const express = require("express");
const router = express.Router();
const tryCatcher = require("../utils/tryCatcher");

const userRoute = require("./users");
router.use("/users", userRoute);
const loginRoute = require("./login");
router.use("/login", loginRoute);
const notificationsRoute = require("./notifications");
router.use("/notifications", notificationsRoute);

router.get(
  "/",
  tryCatcher(async (req, res) => {
    res.send("Welcome Home!");
  })
);

module.exports = router;
