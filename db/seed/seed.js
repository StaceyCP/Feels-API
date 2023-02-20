const { db } = require("../connection");
const Professional = require("../profesionalSchema");

async function seedProfessionals({ professionalsData }) {
  try {
    await Professional.deleteMany({});
    await Professional.createCollection();
    await Professional.insertMany(data);
  } catch (err) {
    console.log(err);
  }
}

module.exports = seedProfessionals;
