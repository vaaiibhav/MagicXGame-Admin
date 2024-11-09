const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { UserModel, UserLocation } = require("../models");
const { dangerConsole, warnConsole } = require("../utils/colorConsoler");
const { UniqueOTP, UniqueCharOTP } = require("unique-string-generator");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");
const { where, Op } = require("sequelize");

const getAllUsers = async (limit = 10, offset = 0, userType, userLoginID) => {
  if (userType === TYPE_ADMIN) {
    return await UserModel.findAll({
      order: [["userLoginID", "Asc"]],
      where: { userLoginID: { [Op.not]: "10" } },
    });
  }
  if (userType === TYPE_SUBADMIN) {
    return await UserModel.findAll({
      where: { userSubAdminID: userLoginID },
      order: [["userLoginID", "Asc"]],
    });
  }
  if (userType === TYPE_MASTER) {
    return await UserModel.findAll({
      where: { userMasterID: userLoginID },
      order: [["userLoginID", "Asc"]],
    });
  }
};
const getAllUsersfromDB = async () => {
  return await UserModel.findAll({ order: [["userLoginID", "Desc"]] });
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
  const { userPassHash, userPinHash } = await passwordHashing({
    password,
    pin,
  });
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
  const { userLoginID } = body;

  const password = UniqueCharOTP(6);
  const pin = UniqueOTP(4);
  const { userPassHash, userPinHash } = await passwordHashing({
    password,
    pin,
  });
  const pinUser = await UserModel.update(
    { userPassHash, userPinHash },
    { where: { userLoginID } }
  );
  return { userLoginID, password, pin };
};
const updateUser = async (
  userName,
  userCity,
  userPhoneNumber,
  userSubAdminPercentage,
  userMasterPercentage,
  usersAllowedUnder,
  userLoginID
) => {
  return await UserModel.update(
    {
      userName,
      userCity,
      userPhoneNumber,
      userSubAdminPercentage,
      userMasterPercentage,
      usersAllowedUnder,
    },
    { where: { userLoginID } }
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

const loginAdmin = async (userLoginID, userPass) => {
  try {
    const userCred = await UserModel.findOne({
      where: { userLoginID },
    });
    if (userCred) {
      if (
        !(
          userCred.dataValues.userType == TYPE_ADMIN ||
          userCred.dataValues.userType == TYPE_SUBADMIN ||
          userCred.dataValues.userType == TYPE_MASTER
        )
      )
        return { error: "Retailers Not Allowed to Login" };
      const loginAllowed = await validateUser(userPass, userCred.userPassHash);
      if (!loginAllowed) {
        return loginAllowed;
      }
      const userToken = generateToken(userCred);
      return userToken ? userToken : false;
    }
    return userCred ? userCred : false;
  } catch (error) {
    dangerConsole({ error });
    return error;
  }
};
const loginUser = async (userLoginID, userPass) => {
  try {
    const userCred = await UserModel.findOne({
      where: { userLoginID },
    });
    if (userCred) {
      if (
        !(
          userCred.dataValues.userType == TYPE_RETAILER ||
          userCred.dataValues.userType == TYPE_MASTER
        )
      )
        return { error: "Not Allowed to Play Game" };
      const loginAllowed = await validateUser(userPass, userCred.userPassHash);
      if (!loginAllowed) {
        return loginAllowed;
      }
      const userToken = generateToken(userCred);
      return userToken ? userToken : false;
    }
    return userCred ? userCred : false;
  } catch (error) {
    dangerConsole({ error });
    return error;
  }
};
const getUsersBalance = async (userLoginID) => {
  return await UserModel.findOne({
    attributes: ["userBalance", "userAvailableBalance"],
    where: { userLoginID },
  });
};
const createAdmin = async () => {
  const userPreSeed = {
    userName: "New Admin",
    userPassHash:
      "$2b$10$Bh5Syej6VdyzK6cZpVTN8ePNAtA.c.KSnAcqDQREsTmWUdb1wSt/S",
    userCity: "Dubai",
    userBalance: 480000,
    userAvailableBalance: 480000,
    userPhoneNumber: "858955001",
    userType: TYPE_ADMIN,
    userPinHash: "$2b$10$HQ2kpn0D2O4rPEFkraUNneiY3PwbLeqpNjV0waOUSKQtAwOUvRqVS",
    userLoginID: "10",
  };
  return await UserModel.create(userPreSeed);
};
const deleteAllUsersDb = async () => {
  return await UserModel.destroy({ where: {} });
};
module.exports = {
  getAllUsers,
  getUserbyUserName,
  getUserbyId,
  createAdmin,
  deleteAllUsersDb,
  deleteUserbyId,
  createUser,
  updateUser,
  loginUser,
  loginAdmin,
  getAllUsersfromDB,
  getUsersBalance,
  userPinUpdate,
};
