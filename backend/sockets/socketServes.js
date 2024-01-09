const {
  timeRunner,
  userDetails,
  getUserNamefromSocketToken,
  saveGudGudiBets,
  getGameID,
  setUserBalance,
} = require("../controllers/socketController");
const { bid_seperation_in_pack_or_single, debug, bid_amount_calculation, win_check, random_select } = require('../sockets/logic');

// Global bid store
let bid_store = [];

module.exports = async function (io) {
  io.on("connection", (socket) => {
    socket.emit("serverMessage", `Welcome ${socket.userName}`);
    timeRunner(io);
    socket.on("getMyDetails", async (message, callback) => {
      const userDetail = await userDetails(message, socket);
      callback(userDetail.userAvailableBalance);
    });
    socket.on("getGameID", getGameID);
    socket.on("gudGudiBets", (betsData, cb) =>
      saveGudGudiBets(betsData, socket, cb)
    );
    socket.on('update_balance', async (userID) => {
      const userDetail = await userDetails(userID, socket);
      socket.emit("balance", userDetail.userAvailableBalance);
    });

    socket.on('bet', async (data) => {
      let bid = bid_seperation_in_pack_or_single(data.bet);
      try {
        const user = await userDetails(data.userID, socket);
        console.log(bid_amount_calculation(bid))
        if (parseInt(user.userAvailableBalance) >= bid_amount_calculation(bid)) {
          bid_store.push({ userName: user.userName, bid, balance: parseInt(user.userAvailableBalance), time: data.second });
          let bid_amount_made = bid_amount_calculation(bid);
          let current_bal = parseInt(user.userAvailableBalance) - bid_amount_made;
          setUserBalance(current_bal, user.userLoginID);
          socket.emit("balance", current_bal);
          setTimeout(async () => {
            let new_balance;
            let res = win_check(bid, random_select());
            socket.emit("win_loss", res);
            if (res.win) {
              new_balance = current_bal + res.win_amount;
              setUserBalance(current_bal, user.userLoginID);
              socket.emit("balance", new_balance);
            }
          }, (data.second * 1000));
        } else {
          throw new Error("Insufficient balance!");
        }
      } catch (error) {
        console.log(error);
        socket.emit("error", error.message);
      }
    });
  });

  // SOcket TOken Auth
  io.use((socket, next) => {
    if (socket.handshake.auth.token) {
      const decodeToken = getUserNamefromSocketToken(
        socket.handshake.auth.token,
        socket
      );
      if (decodeToken.error) {
        next(new Error("Token Error"));
      } else {
        socket.userName = decodeToken.userName;
        socket.userLoginID = decodeToken.userLoginID;
        socket.userToken = decodeToken;
        next();
      }
    } else {
      next(new Error("Token Missing"));
    }
  });
};
