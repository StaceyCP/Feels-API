const moodRouter = require("express").Router();
const { getMoodDataByUsername } = require("../controllers/app-controller");

moodRouter.route("/:username").get(getMoodDataByUsername);

module.exports = moodRouter;
