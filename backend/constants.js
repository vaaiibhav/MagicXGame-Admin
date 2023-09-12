const JWT_SECRET_KEY = "gfg_jwt_secret_key";
const TOKEN_HEADER_KEY = "gfg_token_header_key";
const POSTGRE_DB = "gudGudiGame";
const POSTGRE_UNAME = "postgres";
const POSTGRE_PASSWD = "Pass@123";
const PORT = 8000;
const SALTROUNDS = 10;
const FE_URI = "http://localhost:3000";
const TYPE_SUBADMIN = "subadmin";
const TYPE_ADMIN = "admin";
const TYPE_RETAILER = "retailer";
const TYPE_MASTER = "master";
const error = {
  FORBIDDEN: {
    status: 403,
    message: "You don't have access right for this module",
  },
  NOT_FOUND: { status: 404, message: "Resource not found" },
  USER_NOT_FOUND: { status: 404, message: "User not found" },
  CDN_ID_MISSING: { status: 403, message: "CDN Id is Missing" },
  INCORRECT_CREDENTIALS: { status: 403, message: "Incorrect Credential" },
  UNAUTHORIZED: { status: 401, message: { error: "Unauthorized" } },
  ALREADY_EXISTS: { status: 409, message: "Already exists" },
  INTERNAL_SERVER_ERROR: { status: 500, message: "Something went wrong!" },
  MIXED_STATUS: { status: 207, message: "Partially processed request" },
  BAD_REQUEST: { status: 400, message: "Bad Request" },
  INCORRECT_STORE_CREDS: {
    status: 503,
    message: "Incorrect Store Key provided, please check permissions granted",
  },
};
module.exports = {
  JWT_SECRET_KEY,
  TOKEN_HEADER_KEY,
  POSTGRE_DB,
  POSTGRE_PASSWD,
  POSTGRE_UNAME,
  SALTROUNDS,
  error,
  PORT,
  FE_URI,
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
};
