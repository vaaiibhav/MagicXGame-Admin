const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const UserModel = sequelize.define("Users", {
  // MOdel attributes
  userID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.TEXT,
  },
  userPassHash: { type: DataTypes.TEXT },
  userCity: { type: DataTypes.TEXT },
  userType: { type: DataTypes.TEXT },
  userBalanceHash: { type: DataTypes.TEXT },
  userPhoneNumber: { type: DataTypes.TEXT },
  userPercentage: { type: DataTypes.TEXT },
  userPinHash: { type: DataTypes.TEXT },
});

module.exports = UserModel;
