const {
  fetchUser,
  addNewUser,
  postNewProfessional,
  fetchProfessional,
  fetchMoodData,
  patchMoodData,
  addNewMoodData,
  patchProfessional,
  fetchWaitingRoomUsers,
  postWaitingRoomUser,
  deleteUserFromWR,
} = require("../models/app-model");

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

exports.getProfessional = (req, res, next) => {
  const { registration } = req.params;

  fetchProfessional(registration)
    .then((professional) => {
      res.status(200).send({ professional });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateProfessional = (req, res, next) => {
  const { registration } = req.params;
  const { body } = req;

  fetchProfessional(registration)
    .then(() => {
      return patchProfessional(registration, body);
    })
    .then((updatedProfessional) => {
      res.status(200).send({ updatedProfessional });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const { body } = req;
  addNewUser(body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getMoodDataByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchMoodData(username)
    .then((moodData) => {
      res.status(200).send({ moodData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postMoodData = async (req, res, next) => {
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

exports.updateMoodData = (req, res, next) => {
  const { username } = req.params;
  const { body } = req;
  fetchUser(username)
    .then(() => {
      return patchMoodData(username, body);
    })
    .then((updatedMoodData) => {
      res.status(200).send({ updatedMoodData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getWaitingRoomUsers = (req, res, next) => {
  fetchWaitingRoomUsers()
    .then((usersInWaitingRoom) => {
      res.status(200).send({ usersInWaitingRoom });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addWaitingRoomUser = (req, res, next) => {
  const {
    username,
    sessionID,
    avatar_url,
    chatTopics,
    connectionID,
    talkingTo,
    isWaiting,
    isProfessional,
  } = req.body;
  postWaitingRoomUser(
    username,
    sessionID,
    avatar_url,
    chatTopics,
    connectionID,
    talkingTo,
    isWaiting,
    isProfessional
  )
    .then((newUserInWaitingRoom) => {
      res.status(201).send({ newUserInWaitingRoom });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeUserFromWR = (req, res, next) => {
  const { username } = req.params;
  deleteUserFromWR(username)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
