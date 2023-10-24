const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
  validatePin,
} = require("../middlewares/userAuth");
const { TransactionsModel, UserModel } = require("../models");
const { dangerConsole, successConsole } = require("../utils/colorConsoler");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");
const { where } = require("sequelize");

const getUsersTransactions = async (userLoginID) => {
  const sentTransactions = await TransactionsModel.findAll({
    order: [["transactionID", "DESC"]],
    where: {
      transactionFrom: userLoginID,
    },
  });
  const receivedTransactions = await TransactionsModel.findAll({
    order: [["transactionID", "DESC"]],
    where: {
      transactionTo: userLoginID,
    },
  });
  return { sentTransactions, receivedTransactions };
};
const createTransaction = async (
  transactionFrom,
  transactionTo,
  transactionAmount,
  userPin,
  userPinHash,
  userType
) => {
  const pinValidation = await validatePin(userPin, userPinHash);
  if (!pinValidation) return JSON.stringify({ error: "Pin Incorrect" });
  const { userAvailableBalance } = await UserModel.findOne({
    attributes: ["userAvailableBalance"],
    where: { userLoginID: transactionFrom },
  });

  // switch (userType) {
  //   case TYPE_SUBADMIN:
  //     if (transactionTo.substr(0, 4) !== transactionFrom.substr(0, 4))
  //       return JSON.stringify({ error: "Cannot Transfer to this User" });
  //     break;
  //   case TYPE_MASTER:
  //     if (transactionTo.substr(0, 4) !== transactionFrom.substr(0, 4))
  //       return JSON.stringify({ error: "Cannot Transfer to this User" });
  //     break;
  //   case TYPE_RETAILER:
  //     if (transactionTo.substr(0, 6) !== transactionFrom.substr(0, 6))
  //       return JSON.stringify({ error: "Cannot Transfer to this User" });
  //     break;

  //   default:
  //     break;
  // }
  if (parseInt(transactionAmount) > parseInt(userAvailableBalance))
    return JSON.parse({ error: "Not Enough Balance" });

  return await UserModel.update(
    { userAvailableBalance: userAvailableBalance - transactionAmount },
    { where: { userLoginID: transactionFrom } }
  )
    .then(async () => {
      await TransactionsModel.create({
        transactionFrom,
        transactionTo,
        transactionAmount,
        transactionStatus: "pending",
        transactionMode: "sent",
        userPreviousBalance: userAvailableBalance,
      });
    })
    .catch((error) => {
      dangerConsole({ error });
    });
};

module.exports = {
  getUsersTransactions,
  createTransaction,
};
