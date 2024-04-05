const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const GudGudiModel = sequelize.define("GudGudibets", {
  // MOdel attributes
  gudGudiBetID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
  },
  slot0Bet: { type: DataTypes.INTEGER, defaultValue: 0 },
  slot1Bet: { type: DataTypes.INTEGER, defaultValue: 0 },
  slot2Bet: { type: DataTypes.INTEGER, defaultValue: 0 },
  slot3Bet: { type: DataTypes.INTEGER, defaultValue: 0 },
  slot4Bet: { type: DataTypes.INTEGER, defaultValue: 0 },
  slot5Bet: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalBet: { type: DataTypes.INTEGER, defaultValue: 0 },
  gameID: { type: DataTypes.INTEGER, primaryKey: true },
  userLoginID: { type: DataTypes.TEXT },
});
// GudGudiModel.sync({ force: true, alter: true });

module.exports = GudGudiModel;
