const mongoose = require("mongoose");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });
const url = process.env.MONG_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to Local DB using");
  })
  .catch((err) => {
    console.log("Oops" + err);
  });

const db = mongoose.createConnection();

module.exports = { db };
