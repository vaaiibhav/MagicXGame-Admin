const express = require("express");
const router = express.Router();
const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("../utils/colorConsoler");
const {
  getNotifications,
  createNotification,
  deleteNotification,
} = require("../controllers/notificationsController");
const { passwordHashing, validateToken } = require("../middlewares/userAuth");
const tryCatcher = require("../utils/tryCatcher");
router.get(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const { userType } = req.user;
    const notificationData = await getNotifications(userType);
    res.status(200).json(notificationData);
  })
);
router.post(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const { notificationText, notificationType } = req.body;
    const create = createNotification(notificationText, notificationType);
    res.status(200).json(create);
  })
);
router.delete(
  "/:notificationID",
  validateToken,
  tryCatcher(async (req, res) => {
    const { notificationID } = req.params;
    const deleted = deleteNotification(notificationID);
    res.status(200).json(deleted);
  })
);

module.exports = router;
