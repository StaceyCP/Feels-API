const { getMoodDataByUsername } = require("../controllers/app-controller");

const moodRouter = require("express").Router();
moodRouter.route("/:username").get(getMoodDataByUsername);

module.exports = moodRouter;
