const { timeRunner, userBalance } = require("../controllers/socketController");
module.exports = async function (io) {
  io.on("connection", (socket) => {
    console.log("New Connection", socket.id);
    timeRunner(io);
    socket.on("getMyBalance", (token) => userBalance(token, socket));
  });
};
