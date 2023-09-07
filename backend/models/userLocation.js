const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const UserLocation = sequelize.define("UserLocation", {
  // MOdel attributes
  locationId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  locationLat: {
    type: DataTypes.TEXT,
  },
  locationLang: { type: DataTypes.TEXT },
});

module.exports = UserLocation;
