const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  JWT_SECRET_KEY,
  SALTROUNDS,
  TOKEN_HEADER_KEY,
} = require("../constants");

const generateToken = () => {
  let jwtSecretKey = JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
  };

  const token = jwt.sign(data, jwtSecretKey);
  console.log("token:", token);
};

const validateToken = () => {
  let tokenHeaderKey = TOKEN_HEADER_KEY;
  let jwtSecretKey = JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return "success";
    } else {
      // Access Denied
      return "fail";
    }
  } catch (error) {
    // Access Denied
    return "error";
  }
};
const passwordHashing = async (body) => {
  const { password, pin } = body;
  const userPassHash = await bcrypt
    .hash(password, SALTROUNDS)
    .then((passHash) => {
      return passHash;
    })
    .catch((err) => {
      console.error(err.message);
      return {};
    });
  const userPinHash = await bcrypt
    .hash(pin, SALTROUNDS)
    .then((pinHash) => {
      return pinHash;
    })
    .catch((err) => {
      console.error(err.message);
      return {};
    });
  return { userPassHash, userPinHash };
};
const validateUser = async (password, hash) => {
  return bcrypt
    .compare(password, hash)
    .then((res) => {
      console.log("res:", res);
      return res;
    })
    .catch((err) => console.error(err.message));
};
const compareUser = async (password) => {
  console.log("password: -->", password);
  return bcrypt
    .hash(password, SALTROUNDS)
    .then((hash) => {
      userHash = hash;
      console.log("Hash ", hash);
      return validateUser(password, hash);
    })
    .catch((err) => console.error(err.message));
};

module.exports = {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
};
