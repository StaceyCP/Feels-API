const mongoose = require("mongoose");
const { Schema } = mongoose;

const profesionalSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  availableHours: { type: Array, required: true },
  avatarURL: { type: String, required: true },
});

const Professional = mongoose.model("Professional", profesionalSchema);

module.exports = Professional;
