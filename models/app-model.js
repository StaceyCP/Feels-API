const Professional = require("../db/schemas/professionalSchema");

exports.postNewProfessional = (
  fullName,
  email,
  registrationNumber,
  availableHours,
  avatarURL
) => {
  if (registrationNumber && !/^CP\d{6}$/g.test(registrationNumber)) {
    return Promise.reject({
      status: 400,
      message: "registration number is not the correct format",
    });
  }
  return Professional.find({ registrationNumber }).then((result) => {
    if (result.length > 0) {
      return Promise.reject({
        status: 400,
        message: "registration already in use",
      });
    } else {
      return Professional.create({
        fullName,
        email,
        registrationNumber,
        availableHours,
        avatarURL,
      }).then((newProfessional) => newProfessional);
    }
  });
};
