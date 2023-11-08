var Timer = require("easytimer.js").Timer;
var timer = new Timer();
const { gudGudiGameTimer } = require("../constants");

const timeRunner = (socket, clientCount) => {
  if (clientCount == 1) {
    timer.start({
      countdown: true,
      startValues: { seconds: gudGudiGameTimer },
    });
    timer.addEventListener("secondsUpdated", function (e) {
      let countdown = timer.getTotalTimeValues().seconds;
      countdown = parseInt(countdown);
      socket.transmit("gameTimer", countdown);
      return countdown;
    });
    timer.addEventListener("stopped", function (e) {
      console.log("New Game Event:");
      timer.start({
        countdown: true,
        startValues: { seconds: gudGudiGameTimer },
      });
    });
  } else if (clientCount == 0) {
    timer.stop();
  }
};
module.exports = {
  timeRunner,
};
