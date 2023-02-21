const apiRouter = require("express").Router();
const professionalsRouter = require("./professionalsRouter");
const userRouter = require("./userRouter");
const moodRouter = require("./moodRouter");

apiRouter.use("/professionals", professionalsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/mood_data", moodRouter);

module.exports = apiRouter;
