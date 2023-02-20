const { fetchUser } = require("../models/app-model");

const getUserById = (req, res, next) => {
  const { user_id } = req.params;
  fetchUser(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUserById };
