const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserbyUserName,
  getUserbyId,
  deleteUserbyId,
  createUser,
  updateUser,
  userPinUpdate,
  getAllUsersfromDB,
  deleteAllUsersDb,
  createAdmin,
  getUsersBalance,
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
      userName,
      userCity,
      userPhoneNumber,
      userSubAdminPercentage,
      userMasterPercentage,
    } = req.body;
    const { userID, userType, userMasterID, userSubAdminID, userLoginID } =
      req.user;
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
  validateToken,
  tryCatcher(async (req, res) => {
    const {
      userName,
      userCity,
      userPhoneNumber,
      userSubAdminPercentage,
      userMasterPercentage,
      usersAllowedUnder,
      userLoginID,
    } = req.body;
    const user = await updateUser(
      userName,
      userCity,
      userPhoneNumber,
      userSubAdminPercentage,
      userMasterPercentage,
      usersAllowedUnder,
      userLoginID
    );
    res.json({ user }).status(200);
  })
);
router.get(
  "/user-balance",
  validateToken,
  tryCatcher(async (req, res) => {
    const { userLoginID } = req.user;
    console.log("req.user:", req.user.userLoginID);
    const userBalance = await getUsersBalance(userLoginID);
    res.json(userBalance).status(200);
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
  "/allDBUsers",
  tryCatcher(async (req, res) => {
    const allUsersFromDB = await getAllUsersfromDB();
    res.json(allUsersFromDB).status(200);
  })
);
router.get(
  "/deleteAllUsers",
  tryCatcher(async (req, res) => {
    const deleteAllUsersFromDB = await deleteAllUsersDb();
    res.json(deleteAllUsersFromDB).status(200);
  })
);
router.get(
  "/createAdmin",
  tryCatcher(async (req, res) => {
    const adminCreator = createAdmin();
    res.json(adminCreator).status(200);
  })
);
router.get(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const { limit, offset } = req.query;
    const { userType, userLoginID } = req.user;
    const users = await getAllUsers(limit, offset, userType, userLoginID);
    res.json(users).status(200);
  })
);
module.exports = router;
