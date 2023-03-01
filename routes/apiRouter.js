const apiRouter = require("express").Router();
const moodRouter = require("./moodRouter");
const professionalsRouter = require("./professionalsRouter");
const userRouter = require("./userRouter");
const waitingRoomRouter = require("./waitingRoomRouter");

apiRouter.use("/professionals", professionalsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/mood_data", moodRouter);
apiRouter.use("/waiting_room", waitingRoomRouter);

module.exports = apiRouter;
