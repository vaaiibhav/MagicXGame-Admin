const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbConnection");

const NotificationModel = sequelize.define("NotificationModel", {
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
NotificationModel.sync({ alter: true });
module.exports = NotificationModel;
