const GudGudiModel = require("./gudGudiModel");
const GudGudiWinningsModel = require("./gudGudiWinnings");

GudGudiModel.hasMany(GudGudiWinningsModel, { foreignKey: "gameID" });
GudGudiWinningsModel.belongsTo(GudGudiModel, { foreignKey: "gameID" });
