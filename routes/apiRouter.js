const userRouter = require("./userRouter");

const apiRouter = require("express").Router();

apiRouter.use("/users", userRouter);

module.exports = apiRouter;
