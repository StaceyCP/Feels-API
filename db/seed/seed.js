const { db } = require("../connection");
const User = require("../schemas/userSchema");
const Professional = require("../schemas/professionalSchema");
const UserMood = require("../schemas/userMoodSchema");
const WaitingRoom = require("../schemas/waitingRoomSchema");
const Messages = require("../schemas/messagesSchema");

async function seed({
  professionalsData,
  usersData,
  moodTrackingData,
  waitingRoomData,
}) {
  try {
    await User.deleteMany({});
    await Professional.deleteMany({});
    await UserMood.deleteMany({});
    await WaitingRoom.deleteMany({});
    await Messages.deleteMany({});
    await User.insertMany(usersData);
    await Professional.insertMany(professionalsData);
    await UserMood.insertMany(moodTrackingData);
    await WaitingRoom.insertMany(waitingRoomData);
  } catch (err) {
    console.log(err);
  }
}

module.exports = seed;
