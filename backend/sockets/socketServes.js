const {
  timeRunner,
  userDetails,
  getUserNamefromSocketToken,
  saveGudGudiBets,
} = require("../controllers/socketController");
module.exports = async function (io) {
  io.on("connection", (socket) => {
    console.log("New Connection", socket.id);
    socket.emit("serverMessage", `Welcome ${socket.userName}`);
    timeRunner(io);
    socket.on("getMyDetails", async (message, callback) => {
      const userDetail = await userDetails(message, socket);
      console.log("userDetail:", userDetail);
      callback(userDetail.userAvailableBalance);
    });
    socket.on("gudGudiBets", (betsData) => saveGudGudiBets(betsData, socket));
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
