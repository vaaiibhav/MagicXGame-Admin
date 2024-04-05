const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const GudGudiUsersWinnings = sequelize.define("GudGudiUsersWinnings", {
  // MOdel attributes
  userWinningNumberID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userLoginID: { type: DataTypes.TEXT },
  userSlot0Winning: { type: DataTypes.INTEGER },
  userSlot1Winning: { type: DataTypes.INTEGER },
  userSlot2Winning: { type: DataTypes.INTEGER },
  userSlot3Winning: { type: DataTypes.INTEGER },
  userSlot4Winning: { type: DataTypes.INTEGER },
  userSlot5Winning: { type: DataTypes.INTEGER },
  userTotalWinning: { type: DataTypes.INTEGER },
  gameID: { type: DataTypes.INTEGER },
});
// GudGudiUsersWinnings.sync({ alter: true, force: true });

module.exports = GudGudiUsersWinnings;
