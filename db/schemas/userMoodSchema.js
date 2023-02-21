const mongoose = require("mongoose");
const { Schema } = mongoose;

const userMoodSchema = new Schema(
  {
    username: { type: String, required: true },
    date_joined: { type: String, required: true },
    mood_data: { type: Array, required: true },
  },
  { timestamps: true }
);

const UserMood = mongoose.model("UserMood", userMoodSchema);

module.exports = UserMood;
