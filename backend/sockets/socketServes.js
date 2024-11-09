const {
  timeRunner,
  userDetails,
  getUserNamefromSocketToken,
  saveGudGudiBets,
  getGameID,
} = require("../controllers/socketController");
module.exports = async function (io) {
  io.on("connection", (socket) => {
    socket.emit("serverMessage", `Welcome ${socket.userName}`);
    try {
      timeRunner(io);
    } catch (error) {
      console.error(error);
    }
    socket.on("getMyDetails", async (message, callback) => {
      const userDetail = await userDetails(message, socket);
      callback(userDetail.userAvailableBalance);
    });
    socket.on("getGameID", getGameID);
    socket.on("gudGudiBets", (betsData, cb) =>
      saveGudGudiBets(betsData, socket, cb)
    );
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
