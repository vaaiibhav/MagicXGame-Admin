const express = require("express");
const app = express();
const winston = require('winston');
const NewrelicWinston = require('newrelic-winston');
winston.add(new NewrelicWinston());
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { FE_URI, errors } = require("./constants");
const morgan = require("morgan");
const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("./utils/colorConsoler");
const Port = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("common"));
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
});
app.use(
  cors({
    origin: FE_URI,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/", routes);
// GLobal Error Handler
app.use(function (err, req, res, next) {
  console.log("requested URL", req.url);
  logger.log(err);
  console.log("Global Error", err);
  if (err.status) res.status(err.status).send(err);
  else
    res
      .status(errors.INTERNAL_SERVER_ERROR.status)
      .send(errors.INTERNAL_SERVER_ERROR);
});
app.listen(Port, () => {
  console.log(`Server Listening on ${Port}`);
  successConsole(`Server Listening on ${Port}`);
});
