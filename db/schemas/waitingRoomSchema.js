const mongoose = require("mongoose");

const { Schema } = mongoose;

const waitingRoomSchema = new Schema(
  {
    username: { type: String, required: true },
    socketID: { type: String, required: true },
    avatar_url: { type: String, required: true },
    chatTopics: { type: String },
  },
  { timestamps: true }
);

const WaitingRoom = mongoose.model("WaitingRoom", waitingRoomSchema);

module.exports = WaitingRoom;
