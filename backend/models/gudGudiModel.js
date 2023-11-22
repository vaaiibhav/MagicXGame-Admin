const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const GudGudiModel = sequelize.define("GudGudibets", {
  // MOdel attributes
  gudGudiBetID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  slot0Bet: { type: DataTypes.INTEGER },
  slot1Bet: { type: DataTypes.INTEGER },
  slot2Bet: { type: DataTypes.INTEGER },
  slot3Bet: { type: DataTypes.INTEGER },
  slot4Bet: { type: DataTypes.INTEGER },
  slot5Bet: { type: DataTypes.INTEGER },
  totalBet: { type: DataTypes.INTEGER },
  gameID: { type: DataTypes.INTEGER },
  userLoginID: { type: DataTypes.TEXT },
});

module.exports = GudGudiModel;
