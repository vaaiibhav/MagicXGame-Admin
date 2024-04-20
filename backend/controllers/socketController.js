const { gudGudiGameTimer, gudGudiPercentage } = require("../constants");
// const { createClient } = require("redis");
const { sequelize } = require("../utils/dbConnection");

var redisClient;
var addFromPreviousGiveout = 0;
// (async function () {
//   redisClient = await createClient()
//     .on("error", (err) => console.error("Redis Client Error", err))
//     .connect();
// })();
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
var gameID = 0;
let timerRunning = false;
const timeRunner = (io) => {
  async function* countdownTimer() {
    while (true) {
      yield timeLeft--;
      if (timeLeft === 0) {
        timeLeft = gudGudiGameTimer;
        io.emit("gameDate", new Date());
        io.emit("gameID", gameID++);
        console.log("gameID IN:", gameID);
      }
      if (timeLeft === 2) {
        const GudiWinningNumber = await getGudGudiWinningNumber();
        io.emit("gudGudiWinningNumbers", GudiWinningNumber);
      }
      if (timeLeft === 58)
        io.emit("gudGudiLastWinning", await gudGudiLastwinning());
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
const getLatestGameID = async () => {
  let GudGudiWinningsMaxID = await GudGudiWinningsModel.max("gameID");
  let GudGudiModelMaxID = await GudGudiModel.max("gameID");
  gameID =
    GudGudiWinningsMaxID > GudGudiModelMaxID
      ? GudGudiWinningsMaxID + 1
      : GudGudiModelMaxID + 1;
  console.log("gameID IN:", gameID);
};
getLatestGameID();
const userDetails = async (message, socket) => {
  return await UserModel.findOne({
    where: {
      userLoginID: socket.userLoginID,
    },
  });
};
const gudGudiLastwinning = async () => {
  const lastTenRecords = await GudGudiWinningsModel.findAll({
    limit: 10, // Limit the result to 10 records
    order: [["createdAt", "DESC"]], // O
  });
  const dataValuesOnly = lastTenRecords.map((record) => record.dataValues);
  return dataValuesOnly;
};

async function getWinner(currentBetGiveout, sumsArray) {
  let diceValues = new Array(6).fill(0);
  let currentBuffer = currentBetGiveout;
  let totalWinning = 0;
  let hasGoldenDice = false;
  let remainingHist = 0;
  for (let index = 0; index < diceValues.length; index++) {
    if (diceValues[index] === 0) {
      let probNumbers = [1, 2, 3, 4, 5, 6];
      for (let d = 1; d <= 6; d++) {
        const randomIndex = Math.floor(Math.random() * probNumbers.length);
        if (probNumbers[randomIndex] + remainingHist <= 6) {
          let checkCon = await calculateDice(
            probNumbers[randomIndex],
            sumsArray[d],
            currentBetGiveout
          );
          if (
            checkCon.nearestHit !== -1 &&
            checkCon.product <= currentBetGiveout
          ) {
            diceValues[index] = probNumbers[randomIndex];
            totalWinning += checkCon.product;
            currentBetGiveout -= checkCon.product;
            remainingHist += probNumbers[randomIndex];
            break;
          } else {
            probNumbers.splice(randomIndex, 1);
          }
        } else {
          if (d === 6 || probNumbers.length === 0) {
            diceValues[index] = 0;
          } else {
            probNumbers.splice(randomIndex, 1);
          }
        }
      }
    }
  }
  if (totalWinning * 2 <= currentBuffer) {
    if (totalWinning === 0 && currentBuffer == 0) {
      let randomNumber = Math.floor(Math.random() * 10) + 1;
      if (randomNumber == 6) {
        hasGoldenDice = true;
      }
    } else {
      totalWinning *= 2;
      currentBetGiveout - (totalWinning *= 2);
    }
  }

  return {
    diceValues,
    totalWinning,
    remainingCurrentBetGiveout: currentBetGiveout,
    hasGoldenDice,
  };
}

function calculateDice(hit, amount, currentBetGiveout) {
  const products = {
    0: 0,
    1: amount / 2,
    2: amount * 3,
    3: amount * 5,
    4: amount * 10,
    5: amount * 20,
    6: amount * 50,
  };

  const product = hit * amount;

  // Find the nearest hit based on currentBetGiveout
  let nearestHit = null;
  let minDifference = Infinity;

  for (const key in products) {
    const difference = Math.abs(currentBetGiveout - products[key]);
    if (difference < minDifference) {
      minDifference = difference;
      nearestHit = key;
    }
  }

  // Check if the minimum difference is greater than a threshold (e.g., 10)
  // If it is, consider it as no valid hit and return null for nearestHit
  if (minDifference > 10) {
    nearestHit = null;
  }

  return { nearestHit, product };
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
    sumSlot0Bet ? sumSlot0Bet : 0,
    sumSlot1Bet ? sumSlot1Bet : 0,
    sumSlot2Bet ? sumSlot2Bet : 0,
    sumSlot3Bet ? sumSlot3Bet : 0,
    sumSlot4Bet ? sumSlot4Bet : 0,
    sumSlot5Bet ? sumSlot5Bet : 0,
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
  } = await getWinner(currentBetGiveout, sumSlotArray);
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
  updateUserWinnings(diceValues, hasGoldenDice);
  addFromPreviousGiveout =
    remainingCurrentBetGiveout +
    (totalWinning == 0 ? addFromPreviousGiveout : 0);

  return { diceValues, hasGoldenDice };
};
const updateUserWinnings = async (diceValues, hasGoldenDice) => {
  const getAllUsersBets = await GudGudiModel.findAll({
    where: { gameID },
  });
  for (let index = 0; index < getAllUsersBets.length; index++) {
    const eachUserBets = getAllUsersBets[index]?.dataValues;
    await calculateUsersWinnings(eachUserBets, diceValues, hasGoldenDice);
  }
  async function calculateUsersWinnings(
    eachUserBets,
    diceValues,
    hasGoldenDice
  ) {
    let betArray = [slot0Bet, slot1Bet, slot2Bet, slot3Bet, slot4Bet, slot5Bet];
    for (
      let eachUserBetIndex = 0;
      eachUserBetIndex < betArray.length;
      eachUserBetIndex++
    ) {
      console.log("betArray[eachUserBetIndex]:", betArray[eachUserBetIndex]);
      console.log(
        `eachUserBets[ $(betArray[eachUserBetIndex] )]:`,
        eachUserBets[betArray[eachUserBetIndex]]
      );
      const slotEachBet = eachUserBets[betArray[eachUserBetIndex]];
      console.log("slotEachBet:", slotEachBet);
    }
  }
};
const getUserNamefromSocketToken = (token) => {
  return validateSocketToken(token);
};
const saveGudGudiBets = async (gudGudiBets, socket) => {
  gudGudiBets.userLoginID = socket.userLoginID;
  gudGudiBets.gameID = gameID;
  if (gudGudiBets.totalBet > 0) {
    await GudGudiModel.create(gudGudiBets);
    let currentUser = await UserModel.findOne({
      where: { userLoginID: socket.userLoginID },
    });
    let userCurrentBalance =
      currentUser.userAvailableBalance - gudGudiBets.totalBet;
    await UserModel.update(
      { userAvailableBalance: userCurrentBalance },
      {
        where: {
          userLoginID: socket.userLoginID,
        },
      }
    );
  }
  return; ///////;
};

const getGameID = (...callBack) => {
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
