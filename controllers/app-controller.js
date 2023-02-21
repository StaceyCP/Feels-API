const {
  fetchUser,
  addNewUser,
  postNewProfessional,
  fetchProfessional,
  addNewMoodData,
} = require("../models/app-model");

const addNewProfessional = (req, res, next) => {
  const { fullName, email, registrationNumber, availableHours, avatarURL } =
    req.body;
  postNewProfessional(
    fullName,
    email,
    registrationNumber,
    availableHours,
    avatarURL
  )
    .then((newProfessional) => {
      res.status(201).send({ newProfessional });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const postUser = (req, res, next) => {
  const { body } = req;
  addNewUser(body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const getProfessional = (req, res, next) => {
  const { registration } = req.params;

  fetchProfessional(registration)
    .then((professional) => {
      res.status(200).send({ professional });
    })
    .catch((err) => {
      next(err);
    });
};

const postMoodData = async (req, res, next) => {
  const {
    body: { username },
  } = req;

  fetchUser(username)
    .then(() => {
      return addNewMoodData(username);
    })
    .then((moodData) => {
      res.status(201).send({ moodData });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUserById,
  postUser,
  addNewProfessional,
  getProfessional,
  postMoodData,
};
