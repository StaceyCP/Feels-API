const apiRouter = require("express").Router();
const professionalsRouter = require("./professionalsRouter");

apiRouter.use("/professionals", professionalsRouter);

module.exports = apiRouter;
