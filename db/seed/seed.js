const { db } = require("../connection");
const User = require("../schemas/userSchema");
const Professional = require("../schemas/profesionalSchema");

async function seed({ professionalsData, usersData }) {
  try {
    await User.deleteMany({});
    await Professional.deleteMany({});
    await User.insertMany(usersData);
    await Professional.insertMany(professionalsData);
  } catch (err) {
    console.log(err);
  }
}

module.exports = seed;
