const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserbyUserName,
  getUserbyId,
  deleteUserbyId,
  createUser,
  updateUser,
  loginUser,
  userPinUpdate,
} = require("../controllers/userController");

const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("../utils/colorConsoler");
const { passwordHashing, validateToken } = require("../middlewares/userAuth");
const tryCatcher = require("../utils/tryCatcher");

router.post(
  "/pinupdate",
  tryCatcher(async (req, res) => {
    const result = await userPinUpdate(req.body);
    res.json(req.body).status(200);
  })
);

router.delete(
  "/id/:id",
  tryCatcher(async (req, res) => {
    const { id } = req.params;
    const user = await deleteUserbyId(id);
    res.json({ user }).status(200);
  })
);
router.get(
  "/id/:id",
  tryCatcher(async (req, res) => {
    const { id } = req.params;
    const user = await getUserbyId(id);
    res.json({ user }).status(200);
  })
);
router.post(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const {
      userID,
      userName,
      userCity,
      userType,
      userPhoneNumber,
      userSubAdminPercentage,
      userMasterPercentage,
      userMasterID,
      userSubAdminID,
      userLoginID,
    } = req.body;
    if (
      !userName ||
      !userID ||
      !userCity ||
      !userType ||
      !userPhoneNumber ||
      !userLoginID
    ) {
      return res.json({ error: "Missing Data" }).status(500);
    }
    const { user, password, pin } = await createUser(
      userID,
      userName,
      userCity,
      userType,
      userPhoneNumber,
      userSubAdminPercentage,
      userMasterPercentage,
      userLoginID,
      userMasterID,
      userSubAdminID
    );
    res.json({ ...user.dataValues, password, pin }).status(200);
  })
);

router.put(
  "/",
  tryCatcher(async (req, res) => {
    const { userID, userName, userCity, userPhoneNumber, userPercentage } =
      req.body;
    const user = await updateUser(
      userName,
      userCity,
      userPhoneNumber,
      userPercentage,
      userID
    );
    res.json({ user }).status(200);
  })
);

router.get(
  "/user/:userName",
  tryCatcher(async (req, res) => {
    const { userName } = req.params;
    const user = await getUserbyUserName(userName);
    res.json({ user }).status(200);
  })
);
router.get(
  "/:userType/:userLoginID",
  validateToken,
  tryCatcher(async (req, res) => {
    const { limit, offset } = req.query;
    const { userType, userLoginID } = req.params;
    const users = await getAllUsers(limit, offset, userType, userLoginID);
    res.json(users).status(200);
  })
);
module.exports = router;
