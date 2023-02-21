const { db } = require("../connection");
const User = require("../schemas/userSchema");
const Professional = require("../schemas/professionalSchema");
const UserMood = require("../schemas/userMoodSchema");

async function seed({ professionalsData, usersData, moodTrackingData }) {
  try {
    await User.deleteMany({});
    await Professional.deleteMany({});
    await UserMood.deleteMany({});
    await User.insertMany(usersData);
    await Professional.insertMany(professionalsData);
    await UserMood.insertMany(moodTrackingData);
  } catch (err) {
    console.log(err);
  }
}

module.exports = seed;
