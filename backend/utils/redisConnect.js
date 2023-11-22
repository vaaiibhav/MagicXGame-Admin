const { createClient } = require("redis");

const redisClient = async () => {
  var client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  console.log("client:", client);
  return client;
};
console.log("redisClient:", redisClient);
module.exports = redisClient;
