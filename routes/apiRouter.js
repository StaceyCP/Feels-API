const apiRouter = require("express").Router();
const professionalsRouter = require("./professionalsRouter");
const userRouter = require("./userRouter");

apiRouter.use("/professionals", professionalsRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
