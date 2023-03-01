const { toLocaleString } = require("../db/data/test-data/usersData");
const Professional = require("../db/schemas/professionalSchema");
const UserMood = require("../db/schemas/userMoodSchema");
const User = require("../db/schemas/userSchema");
const WaitingRoom = require("../db/schemas/waitingRoomSchema");

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
  return Professional.create({
    fullName,
    email,
    registrationNumber,
    availableHours,
    avatarURL,
  }).then((newProfessional) => newProfessional);
};

exports.fetchProfessional = (registration) => {
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

exports.patchProfessional = (registration, body) => {
  const reqBodyKeys = Object.keys(body);
  const reqBodyValues = Object.values(body);
  if (
    reqBodyKeys.length === 0 ||
    reqBodyKeys.length > 1 ||
    reqBodyKeys[0] !== "availableHours" ||
    !Array.isArray(reqBodyValues[0])
  ) {
    return Promise.reject({ status: 400, message: "Bad Request!" });
  }
  return Professional.findOneAndUpdate(
    { registrationNumber: registration },
    { $set: { availableHours: body.availableHours } },
    { new: true }
  ).then((updatedProfessional) => {
    return updatedProfessional;
  });
};

exports.addNewUser = async ({ username, email, date_of_birth, avatar_url }) => {
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

exports.fetchUser = (username) => {
  return User.findOne({ username }).then((user) => {
    if (!user) {
      return Promise.reject({ status: 404, message: "username not found" });
    } else return user;
  });
};

exports.addNewMoodData = async (username) => {
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

exports.fetchMoodData = (username) => {
  return UserMood.findOne({ username }).then((data) => {
    if (data === null)
      return Promise.reject({ status: 404, message: "username not found" });
    return data;
  });
};

exports.patchMoodData = (username, newMoodData) => {
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

exports.fetchWaitingRoomUsers = () => {
  return WaitingRoom.find().then((usersInWaitingRoom) => usersInWaitingRoom);
};

exports.postWaitingRoomUser = (
  username,
  sessionID,
  avatar_url,
  chatTopics,
  connectionID,
  talkingTo,
  isWaiting,
  isProfessional
) => {
  return WaitingRoom.create({
    username,
    sessionID,
    avatar_url,
    chatTopics,
    connectionID,
    talkingTo,
    isWaiting,
    isProfessional,
  }).then((newUserInWaitingRoom) => newUserInWaitingRoom);
};

exports.deleteUserFromWR = (username) => {
  return WaitingRoom.findOneAndDelete({ username: username });
};
