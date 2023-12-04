const { gudGudiGameTimer, gudGudiPercentage } = require("../constants");
const { createClient } = require("redis");
const { sequelize } = require("../utils/dbConnection");

var redisClient;
var addFromPreviousGiveout = 0;
(async function () {
  redisClient = await createClient()
    .on("error", (err) => console.error("Redis Client Error", err))
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
const {
  UserModel,
  UserLocation,
  GudGudiModel,
  GudGudiWinningsModel,
} = require("../models");
const { successConsole } = require("../utils/colorConsoler");
const { where } = require("sequelize");
var timeLeft = gudGudiGameTimer;
let timerRunning = false;
let gameID = 0;
const timeRunner = (io) => {
  async function* countdownTimer() {
    while (true) {
      yield timeLeft--;
      if (timeLeft === 0) {
        timeLeft = gudGudiGameTimer;
        io.emit("gameDate", new Date());
        io.emit("gameID", gameID++);
      }
      if (timeLeft === 2) {
        const GudiWinningNumber = await getGudGudiWinningNumber();
        io.emit("gudGudiWinningNumbers", GudiWinningNumber);
      }
    }
  }
  if (!timerRunning) {
    timerRunning = true;
    const timerGenerator = countdownTimer();
    async function countdown() {
      const remainingSeconds = await timerGenerator.next();
      io.emit("gameTimer", remainingSeconds.value);
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

function calculateDiceValues(currentBetGiveout, sumsArray) {
  const winningHits = [0, 1, 3, 4, 5, 6];
  let result = null;
  let totalWinning = 0;
  let hasGoldenDice = false;

  function calculateAmount(hit, amount) {
    if (hit === 0) return 0;
    else if (hit === 1) return amount / 2;
    else if (hit === 3) return amount * 5;
    else if (hit === 4) return amount * 10;
    else if (hit === 5) return amount * 20;
    else if (hit === 6) return amount * 50;
  }

  function generate(combo, index, remainingGiveout, totalHits) {
    if (index === 6) {
      if (totalHits === 6 && remainingGiveout >= 0) {
        result = combo.slice(); // Store valid combination
        totalWinning = sumsArray.reduce(
          (acc, amount, i) => acc + calculateAmount(combo[i], amount),
          0
        );

        if (
          totalWinning <= currentBetGiveout &&
          totalWinning * 2 <= currentBetGiveout
        ) {
          totalWinning *= 2; // Double winnings if it fits in currentBetGiveout and can be doubled
          hasGoldenDice = true;
        }
      }
      return;
    }

    for (let hit of winningHits) {
      const possibleHits = Math.min(6 - totalHits, hit);
      combo.push(possibleHits);
      const winningAmount = calculateAmount(possibleHits, sumsArray[index]);
      generate(
        combo,
        index + 1,
        remainingGiveout - winningAmount,
        totalHits + possibleHits
      );
      combo.pop();
    }
  }

  generate([], 0, currentBetGiveout, 0);
  const remainingCurrentBetGiveout = currentBetGiveout - totalWinning;

  return {
    diceValues: result,
    totalWinning,
    remainingCurrentBetGiveout,
    hasGoldenDice,
  };
}
const getGudGudiWinningNumber = async () => {
  const {
    sumSlot0Bet,
    sumSlot1Bet,
    sumSlot2Bet,
    sumSlot3Bet,
    sumSlot4Bet,
    sumSlot5Bet,
    sumTotalBet,
  } = await getAllBetsOnThisGame();
  let sumSlotArray = [
    sumSlot0Bet,
    sumSlot1Bet,
    sumSlot2Bet,
    sumSlot3Bet,
    sumSlot4Bet,
    sumSlot5Bet,
  ];
  let currentBetGiveout = (gudGudiPercentage * sumTotalBet) / 100;
  currentBetGiveout == 0
    ? addFromPreviousGiveout
    : currentBetGiveout + addFromPreviousGiveout;
  const {
    diceValues,
    totalWinning,
    remainingCurrentBetGiveout,
    hasGoldenDice,
  } = calculateDiceValues(currentBetGiveout, sumSlotArray);
  await GudGudiWinningsModel.create({
    slot0TotalBets: sumSlot0Bet ? sumSlot0Bet : 0,
    slot1TotalBets: sumSlot1Bet ? sumSlot0Bet : 0,
    slot2TotalBets: sumSlot2Bet ? sumSlot0Bet : 0,
    slot3TotalBets: sumSlot3Bet ? sumSlot0Bet : 0,
    slot4TotalBets: sumSlot4Bet ? sumSlot0Bet : 0,
    slot5TotalBets: sumSlot5Bet ? sumSlot0Bet : 0,
    slotTotalBets: sumTotalBet ? sumSlot0Bet : 0,
    slot0Winning: diceValues[0],
    slot1Winning: diceValues[1],
    slot2Winning: diceValues[2],
    slot3Winning: diceValues[3],
    slot4Winning: diceValues[4],
    slot5Winning: diceValues[5],
    totalWinning,
    remainingCurrentBetGiveout,
    hasGoldenDice,
    gameID,
  });
  console.log("Dice Values:", diceValues);
  console.log("Total Winning:", totalWinning);
  console.log("Remaining CurrentBetGiveout:", remainingCurrentBetGiveout);
  addFromPreviousGiveout =
    remainingCurrentBetGiveout +
    (totalWinning == 0 ? addFromPreviousGiveout : 0);
  console.log("addFromPreviousGiveout:", addFromPreviousGiveout);
  console.log("Has Golden Dice:", hasGoldenDice);

  return { diceValues, hasGoldenDice };
};
const getUserNamefromSocketToken = (token) => {
  return validateSocketToken(token);
};
const saveGudGudiBets = async (gudGudiBets, socket, callBack) => {
  gudGudiBets.userLoginID = socket.userLoginID;
  gudGudiBets.gameID = gameID;
  console.log("gudGudiBets:", gudGudiBets);
  if (gudGudiBets.gameID > 0) await GudGudiModel.create(gudGudiBets);
  return callBack("success");
};
const getGameID = (...callBack) => {
  console.log("askGameID:", callBack);
  let callBackFunction = callBack[1];
  callBackFunction(gameID);
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
  getGameID,
};
