const moodRouter = require("express").Router();
const {
  updateMoodData,
  getMoodDataByUsername,
  postMoodData,
} = require("../controllers/app-controller");

moodRouter.route("/").post(postMoodData);
moodRouter.route("/:username").get(getMoodDataByUsername).patch(updateMoodData);

module.exports = moodRouter;
