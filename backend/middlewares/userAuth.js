const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  JWT_SECRET_KEY,
  SALTROUNDS,
  TOKEN_HEADER_KEY,
} = require("../constants");

const generateToken = (data) => {
  // delete data.dataValues.userPassHash;
  // delete data.dataValues.userPinHash;
  delete data.dataValues.userBalance;
  delete data.dataValues.userAvailableBalance;
  const token = jwt.sign(data.dataValues, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};
const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.json({ error: "No Token, Please Re Login" });
    }
    const verified = jwt.verify(token, JWT_SECRET_KEY);
    if (verified) {
      req.user = jwt.decode(token);
      next();
      return "success";
    } else {
      // Access Denied
      return "fail";
    }
  } catch (error) {
    // Access Denied
    console.error("error:", error);
    return res.status(401).json({ error: "Token Expired, Please Re Login" });
  }
};
const validateSocketToken = (token) => {
  try {
    const verified = jwt.verify(token, JWT_SECRET_KEY);
    if (verified) {
      const decodedToken = jwt.decode(token);
      return decodedToken;
    } else {
      // Access Denied
      return { error: "Token Failed, Please Re Login" };
    }
  } catch (error) {
    console.error("error:", error);
    return { error: "Token Expired, Please Re Login" };
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
    .hash(pin.toString(), SALTROUNDS)
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
      return res;
    })
    .catch((err) => console.error(err.message));
};
const validatePin = (pin, hash) => {
  return bcrypt
    .compare(pin, hash)
    .then((res) => {
      return res;
    })
    .catch((err) => console.error(err.message));
};
const compareUser = async (password) => {
  return bcrypt
    .hash(password, SALTROUNDS)
    .then((hash) => {
      userHash = hash;
      return validateUser(password, hash);
    })
    .catch((err) => console.error(err.message));
};
const createHash = async (toHash) => {
  return await bcrypt
    .hash(toHash, SALTROUNDS)
    .then((passHash) => {
      return passHash;
    })
    .catch((err) => {
      console.error(err.message);
      return err.message;
    });
};

module.exports = {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
  validatePin,
  validateSocketToken,
  createHash,
};
