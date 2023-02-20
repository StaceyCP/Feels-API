const mongoose = require("mongoose");
const { Schema } = mongoose;

const profesionalSchema = new Schema({
  fullName: String,
  email: String,
  registrationNumber: String,
  availableHours: [{ day: String, hours: [Number] }],
  avatarURL: String,
});

const Professional = mongoose.model("Professional", profesionalSchema);

module.exports = Professional;
