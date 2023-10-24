const express = require("express");
const router = express.Router();
const tryCatcher = require("../utils/tryCatcher");
const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("../utils/colorConsoler");
const {
  getUsersTransactions,
  createTransaction,
} = require("../controllers/transactionControllers");
const { passwordHashing, validateToken } = require("../middlewares/userAuth");

router.get(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const { userLoginID } = req.user;
    const userTransaction = await getUsersTransactions(userLoginID);
    res.status(200).json(userTransaction);
  })
);

router.post(
  "/",
  validateToken,
  tryCatcher(async (req, res) => {
    const { toUserLoginID, transferAmount, userPin } = req.body;
    const { userLoginID, userPinHash, userType } = req.user;
    const saveTransaction = await createTransaction(
      userLoginID,
      toUserLoginID,
      transferAmount,
      userPin,
      userPinHash,
      userType
    );
    res.status(200).json(saveTransaction);
  })
);

module.exports = router;
