const mongoose = require("mongoose");

const { Schema } = mongoose;

const waitingRoomSchema = new Schema(
  {
    username: { type: String, required: true },
    sessionID: { type: String, required: true },
    avatar_url: { type: String, required: true },
    chatTopics: { type: String },
    connectionID: { type: String, required: true },
    talkingTo: {},
    isWaiting: { type: Boolean },
    isProfessional: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const WaitingRoom = mongoose.model("WaitingRoom", waitingRoomSchema);

module.exports = WaitingRoom;
