const { gudGudiGameTimer } = require("../constants");
const {
  generateToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { UserModel, UserLocation } = require("../models");
var timeLeft = gudGudiGameTimer;
let timerRunning = false;
const timeRunner = (io) => {
  function* countdownTimer() {
    while (true) {
      yield timeLeft--;
      if (timeLeft < 0) {
        timeLeft = gudGudiGameTimer;
      }
    }
  }
  if (!timerRunning) {
    timerRunning = true;
    const timerGenerator = countdownTimer();
    function countdown() {
      const remainingSeconds = timerGenerator.next().value;
      console.log(remainingSeconds + " seconds remaining");
      io.emit("gameTimer", remainingSeconds);
      setTimeout(countdown, 1000);
    }
    countdown();
  }
};
const userBalance = (token, socket) => {
  validateToken(token);
  UserModel.findOne();
  socket.emit("sendUserBalance", 54700);
};
module.exports = {
  timeRunner,
  userBalance,
};
