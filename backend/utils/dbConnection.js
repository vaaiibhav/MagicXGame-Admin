const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("./colorConsoler");
require("dotenv").config({ path: "/.env", debug: true });

const { Sequelize } = require("sequelize");
let sequelize = new Sequelize("gudGudiGame", "postgres", "Pass@123", {
  host: "localhost",
  dialect: "postgres",
});
try {
  sequelize.authenticate();
  successConsole("Connection has been established successfully.");
} catch (error) {
  dangerConsole("Unable to connect to the database:", error);
}

module.exports = { sequelize };
