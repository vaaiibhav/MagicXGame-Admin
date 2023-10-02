const express = require("express");
const router = express.Router();
const tryCatcher = require("../utils/tryCatcher");

const userRoute = require("./users");
router.use("/users", userRoute);
const loginRoute = require("./login");
router.use("/login", loginRoute);

router.get(
  "/",
  tryCatcher(async (req, res) => {
    res.json("Welcome Home!");
  })
);

module.exports = router;
