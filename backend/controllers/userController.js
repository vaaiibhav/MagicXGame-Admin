const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { UserModel, UserLocation } = require("../models");
const { dangerConsole } = require("../utils/colorConsoler");

const getAllUsers = async (limit = 10, offset = 0) => {
  return await UserModel.findAll({
    offset,
    limit,
    attributes: {
      exclude: ["userPassHash"],
    },
  });
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
    userPassHash: "nop",
    userType: "retailer",
    userBalanceHash: 0,
    userPhoneNumber,
    userPercentage,
  });
};
const userPinUpdate = async (body) => {
  const { userID } = body;
  const { userPassHash, userPinHash } = await passwordHashing(body);
  console.log("userPassHash, userPinHash :", userPassHash, userPinHash);
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

const loginUser = async (userName, userPass) => {
  try {
    const userCred = await UserModel.findOne({ where: { userName } });
    console.log("userCred:", userCred);

    if (!userCred == null) {
      const loginAllowed = await validateUser(userPass, userCred.userPassHash);
      if (!loginAllowed) {
        return loginAllowed;
      }
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
