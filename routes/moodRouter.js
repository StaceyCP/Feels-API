const moodRouter = require("express").Router();
const updateMoodData = require("../controllers/app-controller");

moodRouter.route("/:username", updateMoodData);

module.exports = moodRouter;
