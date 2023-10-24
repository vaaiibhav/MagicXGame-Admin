const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const NotificationModel = sequelize.define("Notifications", {
  // MOdel attributes
  notificationID: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  notificationText: {
    type: DataTypes.TEXT,
  },
  notificationType: { type: DataTypes.TEXT },
});

module.exports = NotificationModel;
