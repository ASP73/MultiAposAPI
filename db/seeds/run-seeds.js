const devData = require("../data/test-data/index.js");
const seed = require("./seeds.js");
const db = require("../connection.js");

const runSeed = async () => {
  await seed(devData);
  await db.end();
};

runSeed();
