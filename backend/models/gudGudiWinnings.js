const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const GudGudiWinningsModel = sequelize.define("GudGudiWinnings", {
  // MOdel attributes
  winningNumberID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  slot0TotalBets: { type: DataTypes.INTEGER },
  slot1TotalBets: { type: DataTypes.INTEGER },
  slot2TotalBets: { type: DataTypes.INTEGER },
  slot3TotalBets: { type: DataTypes.INTEGER },
  slot4TotalBets: { type: DataTypes.INTEGER },
  slot5TotalBets: { type: DataTypes.INTEGER },
  slotTotalBets: { type: DataTypes.INTEGER },
  slot0Winning: { type: DataTypes.INTEGER },
  slot1Winning: { type: DataTypes.INTEGER },
  slot2Winning: { type: DataTypes.INTEGER },
  slot3Winning: { type: DataTypes.INTEGER },
  slot4Winning: { type: DataTypes.INTEGER },
  slot5Winning: { type: DataTypes.INTEGER },
  totalWinning: { type: DataTypes.INTEGER },
  remainingCurrentBetGiveout: { type: DataTypes.INTEGER },
  hasGoldenDice: { type: DataTypes.BOOLEAN },
  gameID: { type: DataTypes.INTEGER },
});
// GudGudiWinningsModel.sync({ alter: true, force: true });

module.exports = GudGudiWinningsModel;
