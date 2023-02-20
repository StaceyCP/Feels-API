const { getUserById } = require("../controllers/app-controller");

const userRouter = require("express").Router();

userRouter.route("/").post();
userRouter.route("/:user_id").get(getUserById);

module.exports = userRouter;
