const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    user_id: { type: Number, required: true },
    date_of_birth: { type: String, required: true },
    date_joined: { type: String, required: true },
    avatar_url: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
