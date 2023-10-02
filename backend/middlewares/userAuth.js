const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  JWT_SECRET_KEY,
  SALTROUNDS,
  TOKEN_HEADER_KEY,
} = require("../constants");

const generateToken = (data) => {
  const token = jwt.sign(data.dataValues, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const validateToken = (req, res, next) => {
  try {
    const token = req.cookie.token;
    if (!token) {
      return res.json({ error: "No Token" });
    }
    const verified = jwt.verify(token, JWT_SECRET_KEY);
    if (verified) {
      req.token = verified;
      next();
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

module.exports = {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
};
