const Professional = require("../db/schemas/professionalSchema");
const UserMood = require("../db/schemas/userMoodSchema");
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
      return Promise.reject({ status: 404, message: "username not found" });
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

const fetchMoodData = (username) => {
  return UserMood.findOne({ username }).then((data) => {
    if (data === null)
      return Promise.reject({ status: 404, message: "username not found" });
    return data;
  });
};

const patchMoodData = (username, newMoodData) => {
  const reqBodyKeys = Object.keys(newMoodData);
  const reqBodyValues = Object.values(newMoodData);
  const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/g;
  if (
    reqBodyKeys.length === 0 ||
    reqBodyKeys.length > 1 ||
    !dateRegex.test(reqBodyKeys[0]) ||
    typeof reqBodyValues[0] !== "number" ||
    reqBodyValues[0] < -3 ||
    reqBodyValues[0] > 3
  ) {
    return Promise.reject({
      status: 400,
      message: "PATCH requests must be of format { 'DD/MM/YYYY': mood }",
    });
  }

  return UserMood.findOneAndUpdate(
    { username },
    { $push: { mood_data: newMoodData } },
    { new: true }
  ).then((updatedMoodData) => {
    return updatedMoodData;
  });
};

const addNewMoodData = async (username) => {
  const date_joined = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");
  const newData = new UserMood({
    username,
    date_joined,
    mood_data: [],
  });

  const insertedData = await newData.save();
  return insertedData;
};

module.exports = {
  fetchUser,
  addNewUser,
  postNewProfessional,
  fetchMoodData,
  fetchProfessional,
  patchMoodData,
  addNewMoodData,
};
