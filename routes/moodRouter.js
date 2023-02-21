const moodRouter = require("express").Router();
const {
  updateMoodData,
  getMoodDataByUsername,
} = require("../controllers/app-controller");

moodRouter.route("/:username").get(getMoodDataByUsername).patch(updateMoodData);

module.exports = moodRouter;
