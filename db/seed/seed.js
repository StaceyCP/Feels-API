const { db } = require("../connection");
const User = require("../schemas/userSchema");

const seed = ({ usersData }) => {
  return User.deleteMany({})
    .then(() => {
      console.log("User collection created");
      return User.insertMany(usersData);
    })
    .then(() => {
      console.log("Users data inserted");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = seed;
