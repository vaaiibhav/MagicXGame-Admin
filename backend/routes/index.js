const express = require("express");
const router = express.Router();

const userRoute = require("./users");
router.use("/users", userRoute);

router.get("/", (req, res) => {
  res.json("Welcome Home!");
});

module.exports = router;
