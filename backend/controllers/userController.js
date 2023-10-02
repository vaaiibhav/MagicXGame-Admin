const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { UserModel, UserLocation } = require("../models");
const { dangerConsole } = require("../utils/colorConsoler");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");


const getAllUsers = async (limit = 10, offset = 0, userType, userID) => {
  if (userType === TYPE_ADMIN) {
    return await UserModel.findAll();
  }
  if (userType === TYPE_SUBADMIN) {
    return await UserModel.findAll({
      where: { userSubAdminID: userID },
    });
  }
  if (userType === TYPE_MASTER) {
    return await UserModel.findAll({
      where: { userMasterID: userID },
    });
  }
};
const getUserbyUserName = async (userName) => {
  return await UserModel.findOne({
    where: { userName },
  });
};
const getUserbyId = async (id) => {
  return await UserModel.findByPk(id);
};
const deleteUserbyId = async (userID) => {
  return await UserModel.destroy({ where: { userID } });
};
const createUser = async (
  userName,
  userCity,
  userPhoneNumber,
  userPercentage
) => {
  return await UserModel.create({
    userName,
    userCity,
    userPassHash: "",
    userType: "retailer",
    userBalance: 0,
    userAvailableBalance: 0,
    userPhoneNumber,
    userPercentage,
  });
};
const userPinUpdate = async (body) => {
  const { userID } = body;
  const { userPassHash, userPinHash } = await passwordHashing(body);
  return await UserModel.update(
    { userPassHash, userPinHash },
    { where: { userID } }
  );
};
const updateUser = async (
  userName,
  userCity,
  userPhoneNumber,
  userPercentage,
  userID
) => {
  return await UserModel.update(
    {
      userName,
      userCity,
      userPhoneNumber,
      userPercentage,
    },
    { where: { userID } }
  );
};
const getAvailableUser = async (userType, userID) => {
  if (userType === TYPE_ADMIN) {
    const availCount = await UserModel.findAll({
      where: { userType: TYPE_SUBADMIN },
    });
    return availCount.length;
  } else if (userType === TYPE_SUBADMIN) {
    const availCount = await UserModel.findAll({
      where: { userSubAdminID: userID, userType: TYPE_MASTER },
    });
    return availCount.length;
  } else if (userType === TYPE_MASTER) {
    const availCount = await UserModel.findAll({
      where: { userMasterID: userID, userType: TYPE_RETAILER },
    });
    return availCount.length;
  }
  return 0;
};

const loginUser = async (userLoginID, userPass) => {
  try {
    const userCred = await UserModel.findOne({ where: { userLoginID } });
    if (userCred) {
      const loginAllowed = await validateUser(userPass, userCred.userPassHash);
      if (!loginAllowed) {
        return loginAllowed;
      }
      const userToken = generateToken(userCred);
      return userToken ? userToken : false;
    }
    return userCred ? userCred : false;
  } catch (error) {
    dangerConsole(error);
    return error;
  }
};
module.exports = {
  getAllUsers,
  getUserbyUserName,
  getUserbyId,
  deleteUserbyId,
  createUser,
  updateUser,
  loginUser,
  userPinUpdate,
  getAvailableUser,
};
