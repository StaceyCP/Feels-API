const apiRouter = require("express").Router();
const moodRouter = require("./moodRouter");
const professionalsRouter = require("./professionalsRouter");
const userRouter = require("./userRouter");

apiRouter.use("/professionals", professionalsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/mood_data", moodRouter);

module.exports = apiRouter;
