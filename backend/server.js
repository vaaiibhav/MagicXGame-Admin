const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { FE_URI } = require("./constants");
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
app.use(
  cors({
    origin: FE_URI,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/", routes);

app.listen(Port, () => {
  successConsole(`Server Listening on ${Port}`);
});
