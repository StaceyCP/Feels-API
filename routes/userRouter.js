const { getUserById, postUser } = require("../controllers/app-controller");

const userRouter = require("express").Router();

userRouter.route("/").post(postUser);
userRouter.route("/:username").get(getUserById);

module.exports = userRouter;
