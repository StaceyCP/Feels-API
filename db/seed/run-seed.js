const seed = require("../seed/seed");
const devData = require("../data/development-data");
const { db } = require("../connection");
const mongoose = require("mongoose");

const runSeed = () => {
  return seed(devData).then(() => mongoose.connection.close());
};

runSeed();
