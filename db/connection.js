const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/feels-data")
  .then(() => {
    console.log("Connected to Local DB");
  })
  .catch((err) => {
    console.log("Oops" + err);
  });

const db = mongoose.createConnection();

module.exports = { db };
