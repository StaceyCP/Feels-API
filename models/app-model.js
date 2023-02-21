const User = require("../db/schemas/userSchema");

const fetchUser = (username) => {
  return User.findOne({ username }).then((user) => {
    if (!user) {
      return Promise.reject({ status: 404, message: "id not found" });
    } else return user;
  });
};

const addNewUser = async ({ username, email, date_of_birth, avatar_url }) => {
  const date_joined = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");
  const newUser = new User({
    username,
    email,
    date_of_birth,
    avatar_url,
    date_joined,
  });
  const insertedUser = await newUser.save();
  return insertedUser;
};

module.exports = { fetchUser, addNewUser };
