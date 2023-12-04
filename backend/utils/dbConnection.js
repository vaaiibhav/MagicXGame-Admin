const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("./colorConsoler");
require("dotenv").config({ path: "/.env", debug: true });
const { POSTGRE_DB, POSTGRE_PASSWD, POSTGRE_UNAME } = require("../constants");
const { Sequelize } = require("sequelize");
let sequelize = new Sequelize(POSTGRE_DB, POSTGRE_UNAME, POSTGRE_PASSWD, {
  host: "localhost",
  dialect: "postgres",
  // logging: false,
  // Increase the timeout (in milliseconds)
  dialectOptions: {
    statement_timeout: 30000, // 30 seconds timeout
  },
});
try {
  sequelize.authenticate();
  successConsole("PostGre DB Connection success.");
} catch (error) {
  dangerConsole({ error });
}
module.exports = { sequelize };
