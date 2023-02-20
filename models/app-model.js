const User = require("../db/schemas/userSchema");

const fetchUser = (user_id) => {
  return User.findOne({ user_id: user_id }).then((user) => {
    if (!user) {
      return Promise.reject({ status: 404, message: "id not found" });
    } else return user;
  });
};

module.exports = { fetchUser };
