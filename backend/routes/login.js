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
router.post(
  "/pin-change",
  validateToken,
  tryCatcher(async (req, res) => {
    console.log("req.body:", req.body);
    if (!req.body) res.json({ error: "Error occured" }).status(500);
    const pinPassChange = await userPinUpdate(req.body);
    res.json(pinPassChange).status(200);
  })
);
router.post(
  "/login-game",
  tryCatcher(async (req, res) => {
    const { loginID, loginPD } = req.body;
    if (!loginID || !loginPD) {
      return res.status(401).json({ error: "Empty Credentials" });
    }
    const user = await loginUser(loginID, loginPD);
    if (!user) return res.status(409).json({ error: "Password Invalid" });
    else if (user.error) return res.status(409).json(user);
    res.status(200).json({ token: user });
  })
);
module.exports = router;
