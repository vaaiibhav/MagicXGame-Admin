const express = require("express");
const router = express.Router();
const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("../utils/colorConsoler");
const { passwordHashing, validateToken } = require("../middlewares/userAuth");
const tryCatcher = require("../utils/tryCatcher");
const {
  getRequests,
  createRequest,
} = require("../controllers/requestController");
router.get(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const { userLoginID, userType } = req.user;
    const requestData = await getRequests(userLoginID, userType);
    res.status(200).json(requestData);
  })
);
router.post(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const { userLoginID } = user.token;
    const request = await createRequest(userLoginID);
    res.status(200).json(request);
  })
);

module.exports = router;
