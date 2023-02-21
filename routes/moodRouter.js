const {
  getMoodDataByUsername,
  postMoodData,
} = require("../controllers/app-controller");
const moodRouter = require("express").Router();

moodRouter.route("/").post(postMoodData);
moodRouter.route("/:username").get(getMoodDataByUsername);

module.exports = moodRouter;
