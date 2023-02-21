const { postNewProfessional } = require("../models/app-model");

exports.addNewProfessional = (req, res, next) => {
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
