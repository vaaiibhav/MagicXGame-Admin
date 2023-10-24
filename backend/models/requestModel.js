const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const RequestModel = sequelize.define("Requests", {
  // MOdel attributes
  requestID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  requestText: {
    type: DataTypes.TEXT,
  },
  requestType: { type: DataTypes.TEXT },
  requestByUser: { type: DataTypes.TEXT },
  requestStatus: { type: DataTypes.TEXT },
});

module.exports = RequestModel;
