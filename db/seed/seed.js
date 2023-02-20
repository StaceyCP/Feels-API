const { db } = require("../connection");
const Professional = require("../profesionalSchema");
const professionalsData = require("../data/test-data/professionalsData");

function seedProfessionals(data) {
  return Professional.deleteMany({})
    .then(() => {
      console.log("Droped collection");
      return Professional.createCollection();
    })
    .then(() => {
      console.log("Collection created");
      return Professional.insertMany(data);
    })
    .then(() => {
      console.log("Data inserted");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = seedProfessionals;
