const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { UserModel, UserLocation } = require("../models");
const { dangerConsole } = require("../utils/colorConsoler");
const { UniqueOTP, UniqueCharOTP } = require("unique-string-generator");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");

const getAllUsers = async (limit = 10, offset = 0, userType, userID) => {
  if (userType === TYPE_ADMIN) {
    return await UserModel.findAll({ order: [["userLoginID", "Desc"]] });
  }
  if (userType === TYPE_SUBADMIN) {
    return await UserModel.findAll({
      where: { userSubAdminID: userLoginID },
      order: [["userLoginID", "Desc"]],
    });
  }
  if (userType === TYPE_MASTER) {
    return await UserModel.findAll({
      where: { userMasterID: userLoginID },
      order: [["userLoginID", "Desc"]],
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
  userID,
  userName,
  userCity,
  getuserType,
  userPhoneNumber,
  userSubAdminPercentage,
  userMasterPercentage,
  getuserLoginID,
  userMasterID,
  userSubAdminID
) => {
  // Get available User SLot
  let userType;
  let userSlot;
  if (getuserType == TYPE_ADMIN) {
    userType = TYPE_SUBADMIN;
    userSubAdminID = "";
    userMasterID = "";
    userSlot = await UserModel.count({
      where: { userType },
    });
  }
  if (getuserType == TYPE_SUBADMIN) {
    userType = TYPE_MASTER;
    userSubAdminID = getuserLoginID;
    userSlot = await UserModel.count({
      where: { userType, userSubAdminID: getuserLoginID },
    });
  }
  if (getuserType == TYPE_MASTER) {
    userType = TYPE_RETAILER;
    userSubAdminID = userSubAdminID;
    userMasterID = getuserLoginID;
    userSlot = await UserModel.count({
      where: { userType, userMasterID: getuserLoginID },
    });
  }
  const getUserSlot = ("0" + userSlot).slice(-2).toString();
  const userLoginID = getuserLoginID + getUserSlot;
  const password = UniqueCharOTP(6);
  const pin = UniqueOTP(4);
  const body = { password, pin };
  const { userPassHash, userPinHash } = await passwordHashing(body);
  const user = await UserModel.create({
    userName,
    userCity,
    userPassHash,
    userPinHash,
    userType,
    userLoginID,
    userBalance: 0,
    userAvailableBalance: 0,
    userPhoneNumber,
    userSubAdminID,
    userMasterID,
    userSubAdminPercentage,
    userMasterPercentage,
  });
  return { user, password, pin };
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
// const getAvailableUser = async (userType, userID) => {
//   if (userType === TYPE_ADMIN) {
//     const availCount = await UserModel.findAll({
//       where: { userType: TYPE_SUBADMIN },
//     });
//     return availCount.length;
//   } else if (userType === TYPE_SUBADMIN) {
//     const availCount = await UserModel.findAll({
//       where: { userSubAdminID: userID, userType: TYPE_MASTER },
//     });
//     return availCount.length;
//   } else if (userType === TYPE_MASTER) {
//     const availCount = await UserModel.findAll({
//       where: { userMasterID: userID, userType: TYPE_RETAILER },
//     });
//     return availCount.length;
//   }
//   return 0;
// };

const loginUser = async (userLoginID, userPass) => {
  try {
    const userCred = await UserModel.findOne({
      where: { userLoginID },
    });
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
};
