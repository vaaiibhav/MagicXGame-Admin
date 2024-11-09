const { DataTypes } = require("sequelize");
const { dangerConsole } = require("../utils/colorConsoler");
const { sequelize } = require("../utils/dbConnection");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");
let UserModel = sequelize.define("Users", {
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
  usersAllowedUnder: { type: DataTypes.BIGINT(0), defaultValue: 10 },
});
const userPreSeed = {
  userName: "New Admin",
  userPassHash: "$2b$10$Bh5Syej6VdyzK6cZpVTN8ePNAtA.c.KSnAcqDQREsTmWUdb1wSt/S",
  userCity: "Dubai",
  userBalance: 480000,
  userAvailableBalance: 480000,
  userPhoneNumber: "858955001",
  userType: TYPE_ADMIN,
  userPinHash: "$2b$10$HQ2kpn0D2O4rPEFkraUNneiY3PwbLeqpNjV0waOUSKQtAwOUvRqVS",
  userLoginID: "10",
};
UserModel.count({ where: { userLoginID: "10" } }).then((adminSeeded) => {
  if (adminSeeded < 1) UserModel.create(userPreSeed);
});

module.exports = UserModel;
