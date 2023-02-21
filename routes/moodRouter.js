const { postMoodData } = require("../controllers/app-controller");

const moodRouter = require("express").Router();

moodRouter.route("/").post(postMoodData);

module.exports = moodRouter;
