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
console.log("controllers:", getAllUsers);

const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("../utils/colorConsoler");
const { passwordHashing } = require("../middlewares/userAuth");

router.get("/:userName", async (req, res) => {
  const { userName } = req.params;
  const user = await getUserbyUserName(userName);
  res.json({ user }).status(200);
});

router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserbyId(id);
  res.json({ user }).status(200);
});

router.post("/pinupdate", async (req, res) => {
  const result = await userPinUpdate(req.body);
  res.json(req.body).status(200);
});

router.post("/login", async (req, res) => {
  const { userName, userPass } = req.body;
  if (!userName || !userPass) {
    return res.status(401).json({ error: "Empty Credentials" });
  }
  const user = await loginUser(userName, userPass);
  if (!user) {
    return res.status(401).json({ error: "Password Invalid" });
  }
  res.status(200).json(user);
});

router.get("/", async (req, res) => {
  const { limit, offset } = req.query;
  const users = await getAllUsers(limit, offset);
  res.json({ users }).status(200);
});

router.delete("/id/:id", async (req, res) => {
  const { id } = req.params;
  const user = await deleteUserbyId(id);
  res.json({ user }).status(200);
});

router.post("/", async (req, res) => {
  const { userName, userCity, userType, userPhoneNumber, userPercentage } =
    req.body;
  if (
    !userName ||
    !userCity ||
    !userType ||
    !userPhoneNumber ||
    !userPercentage
  ) {
    return res.json({ error: "Missing Data" }).status(500);
  }
  const user = await createUser(
    userName,
    userCity,
    userType,
    userPhoneNumber,
    userPercentage
  );
  res.json({ user }).status(200);
});

router.put("/", async (req, res) => {
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
});
module.exports = router;
