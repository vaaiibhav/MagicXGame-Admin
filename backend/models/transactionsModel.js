const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const TransactionsModel = sequelize.define("Transactions", {
  // MOdel attributes
  transactionID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  transactionFrom: { type: DataTypes.TEXT },
  transactionTo: { type: DataTypes.TEXT },
  transactionAmount: { type: DataTypes.TEXT },
  transactionStatus: { type: DataTypes.TEXT },
});
TransactionsModel.sync({ alter: true });
module.exports = TransactionsModel;
