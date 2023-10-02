const express = require("express");
const router = express.Router();
const tryCatcher = require("../utils/tryCatcher");
const {
  getAllUsers,
  getUserbyUserName,
  getUserbyId,
  deleteUserbyId,
  createUser,
  updateUser,
  loginUser,
  userPinUpdate,
  getAvailableUser,
} = require("../controllers/userController");

const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("../utils/colorConsoler");
const { passwordHashing, validateToken } = require("../middlewares/userAuth");

router.post(
  "/",
  tryCatcher(async (req, res) => {
    const { userLoginID, userPass } = req.body;
    if (!userLoginID || !userPass) {
      return res.status(401).json({ error: "Empty Credentials" });
    }
    const user = await loginUser(userLoginID, userPass);
    if (!user) {
      return res.status(409).json({ error: "Password Invalid" });
    }
    res.status(200).json({ token: user });
  })
);

router.get(
  "/logout",
  tryCatcher(async (req, res) => {
    res.status(200).clearCookie("token").json({ message: "Logout Success" });
  })
);

router.get(
  "/auth",
  validateToken,
  tryCatcher(async (req, res) => {
    res.json({ message: "token", token: req.token });
  })
);
module.exports = router;
