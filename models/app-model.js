const Professional = require("../db/schemas/professionalSchema");
const User = require("../db/schemas/userSchema");

const postNewProfessional = (
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
  return Professional.create({
    fullName,
    email,
    registrationNumber,
    availableHours,
    avatarURL,
  }).then((newProfessional) => newProfessional);
};

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

const fetchProfessional = (registration) => {
  return Professional.findOne({ registrationNumber: registration }).then(
    (professional) => {
      if (!professional) {
        return Promise.reject({
          status: 404,
          message: "Professional not found",
        });
      } else return professional;
    }
  );
};

module.exports = {
  fetchUser,
  addNewUser,
  postNewProfessional,
  fetchProfessional,
};
