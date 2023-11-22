const { gudGudiGameTimer } = require("../constants");
const { createClient } = require("redis");
const { sequelize } = require("../utils/dbConnection");

var redisClient;
(async function () {
  redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
})();
const {
  generateToken,
  validateSocketToken,
  validateToken,
  passwordHashing,
  validateUser,
  compareUser,
} = require("../middlewares/userAuth");
const { UserModel, UserLocation, GudGudiModel } = require("../models");
const { successConsole } = require("../utils/colorConsoler");
const { where } = require("sequelize");
var timeLeft = gudGudiGameTimer;
let timerRunning = false;
let gameID = 0;
const timeRunner = (io) => {
  function* countdownTimer() {
    while (true) {
      yield timeLeft--;
      if (timeLeft === 0) {
        timeLeft = gudGudiGameTimer;
        io.emit("gameDate", new Date());
        io.emit("gameID", gameID++);
      }
      if (timeLeft === 2) {
        io.emit("gudGudiWinningNumber", getGudGudiWinningNumber);
      }
    }
  }
  if (!timerRunning) {
    timerRunning = true;
    const timerGenerator = countdownTimer();
    function countdown() {
      const remainingSeconds = timerGenerator.next().value;
      // console.log(remainingSeconds + " seconds remaining");
      io.emit("gameTimer", remainingSeconds);
      setTimeout(countdown, 1000);
    }
    countdown();
  }
};
const userDetails = async (message, socket) => {
  return await UserModel.findOne({
    where: {
      userLoginID: socket.userLoginID,
    },
  });
};
const getGudGudiWinningNumber = async () => {
  const GudGudibets = await getAllBetsOnThisGame();
  console.log("betsOnThisGame:", GudGudibets);

  /*  GAME RULES
0 Symbols hit         lose
1 Symbols hit    50%lose bet
2 Symbols hit    win= bet*3𝖝
3 Symbols hit    win= bet*5𝖝
4 Symbols hit    win= bet*10𝖝
5 Symbols hit    win= bet*20𝖝
6 Symbols hit    win= bet*50𝖝
GOLDAN SYMBOLS HIT   win =Dubbale on all winning amaun
  */
};
const getUserNamefromSocketToken = (token) => {
  return validateSocketToken(token);
};
const saveGudGudiBets = async (gudGudiBets, socket) => {
  console.log("gudGudiBets:", gudGudiBets);
  gudGudiBets.userLoginID = socket.userLoginID;
  // console.log("gudGudiBets:", gudGudiBets);
  await GudGudiModel.create(gudGudiBets);
};
const getAllBetsOnThisGame = async () => {
  const sumOfBets = await GudGudiModel.findAll({
    attributes: [
      [sequelize.fn("SUM", sequelize.col("slot0Bet")), "sumSlot0Bet"],
      [sequelize.fn("SUM", sequelize.col("slot1Bet")), "sumSlot1Bet"],
      [sequelize.fn("SUM", sequelize.col("slot2Bet")), "sumSlot2Bet"],
      [sequelize.fn("SUM", sequelize.col("slot3Bet")), "sumSlot3Bet"],
      [sequelize.fn("SUM", sequelize.col("slot4Bet")), "sumSlot4Bet"],
      [sequelize.fn("SUM", sequelize.col("slot5Bet")), "sumSlot5Bet"],
      [sequelize.fn("SUM", sequelize.col("totalBet")), "sumTotalBet"],
    ],
    where: {
      gameID: gameID,
    },
    // group: ["gameID"],
  });
  // const sumOfBets = await GudGudiModel.sum("slot0Bet", { where: { gameID } });
  return sumOfBets[0].dataValues;
};
module.exports = {
  timeRunner,
  userDetails,
  getUserNamefromSocketToken,
  saveGudGudiBets,
};
