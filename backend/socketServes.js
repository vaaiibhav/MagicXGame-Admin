const { timeRunner } = require("./controllers/socketController");
module.exports = async function (agServer) {
  for await (let { socket } of agServer.listener("connection")) {
    let clientCount = agServer.clientsCount;
    console.log("clientCount:", clientCount);

    timeRunner(socket, agServer.clientsCount);

    // Handle socket connection.
    (async () => {
      // Set up a loop to handle remote transmitted events.
      for await (let data of socket.receiver("customRemoteEvent")) {
        console.log("data:", data);
      }
    })();
  }
};
