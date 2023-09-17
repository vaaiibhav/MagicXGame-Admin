const { DataTypes } = require("sequelize");
const { dangerConsole } = require("../utils/colorConsoler");
const { sequelize } = require("../utils/dbConnection");
let UserLocation={};
try {
   UserLocation = sequelize.define("UserLocation", {
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
} catch (error) {
  dangerConsole({error})
}


module.exports = UserLocation;
