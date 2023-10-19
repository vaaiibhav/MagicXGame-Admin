const { DataTypes } = require("sequelize");
const { dangerConsole } = require("../utils/colorConsoler");
const { sequelize } = require("../utils/dbConnection");
let userModel = {}
try {
 UserModel = sequelize.define("Users", {
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
  userBalance: { type: DataTypes.BIGINT(0), allowNull: false },
  userAvailableBalance: { type: DataTypes.BIGINT(0), allowNull: false },
  userPhoneNumber: { type: DataTypes.TEXT },
  userSubAdminPercentage: { type: DataTypes.TEXT },
  userMasterPercentage: { type: DataTypes.TEXT },
  userPinHash: { type: DataTypes.TEXT },
  userMasterID: { type: DataTypes.TEXT },
  userSubAdminID: { type: DataTypes.TEXT },
  userLoginID: { type: DataTypes.TEXT },
  userAllowed: { type: DataTypes.BOOLEAN, defaultValue: true },
});
// UserModel.sync({ alter: true });
module.exports = UserModel;
