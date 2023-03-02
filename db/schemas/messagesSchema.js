const mongoose = require("mongoose");
const { Schema } = mongoose;

const messagesSchema = new Schema({
  message: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const Messages = mongoose.model("Messages", messagesSchema);

module.exports = Messages;
