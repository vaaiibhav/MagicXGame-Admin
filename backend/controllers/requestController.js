const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { Op } = require("sequelize");
const { dangerConsole } = require("../utils/colorConsoler");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");
const { RequestModel, UserModel } = require("../models");

const getRequests = async (userLoginID, userType) => {
  if (userType === TYPE_ADMIN) {
    return await RequestModel.findAll();
  }
  return await RequestModel.findAll({ where: { requestByUser: userLoginID } });
};

const createRequest = async (userLoginID) => {
  return await RequestModel.create({
    requestText,
    requestType,
    requestByUser: userLoginID,
    requestStatus: "processing",
  });
};

module.exports = { getRequests, createRequest };
