const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { NotificationModel } = require("../models");
const { Op } = require("sequelize");
const { dangerConsole } = require("../utils/colorConsoler");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");

const getNotifications = async (userType) => {
  if (userType == TYPE_RETAILER) {
    return (getnotifications = await NotificationModel.findAll({
      order: [["notificationID", "DESC"]],
      where: {
        [Op.or]: [
          { notificationType: TYPE_RETAILER },
          { notificationType: "all" },
        ],
      },
    }));
  }
  if (userType == TYPE_MASTER) {
    return (getnotifications = await NotificationModel.findAll({
      order: [["notificationID", "DESC"]],
      where: {
        [Op.or]: [
          { notificationType: TYPE_MASTER },
          { notificationType: "all" },
        ],
      },
    }));
  }
  if (userType == TYPE_SUBADMIN) {
    return (getnotifications = await NotificationModel.findAll({
      order: [["notificationID", "DESC"]],
      where: {
        [Op.or]: [
          { notificationType: TYPE_SUBADMIN },
          { notificationType: "all" },
        ],
      },
    }));
  }
  return (getnotifications = await NotificationModel.findAll({
    order: [["notificationID", "DESC"]],
  }));
};
const createNotification = async (notificationText, notificationType) => {
  return (createNotification = await NotificationModel.create({
    notificationText,
    notificationType,
  }));
};
const deleteNotification = async (notificationID) => {
  return (deleteNotification = await NotificationModel.destroy({
    where: { notificationID },
  }));
};

module.exports = { getNotifications, createNotification, deleteNotification };
