const express = require("express");
const router = express.Router();
const tryCatcher = require("../utils/tryCatcher");

const userRoute = require("./users");
router.use("/users", userRoute);
const loginRoute = require("./login");
router.use("/login", loginRoute);
const notificationsRoute = require("./notifications");
router.use("/notifications", notificationsRoute);
const transactionsRoute = require("./transactions");
router.use("/transactions", transactionsRoute);
const requestsRoute = require("./requests");
router.use("/requests", requestsRoute);
const gameResult = require("./gameResult");
router.use("/game-result", gameResult);

router.get(
  "/",
  tryCatcher(async (req, res) => {
    res.send("Welcome Home!");
  })
);

module.exports = router;
