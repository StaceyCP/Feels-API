const apiRouter = require("./routes/apiRouter");
const express = require("express");
const {
  handleServerErrors,
  handleMongoErrors,
  handleCustomErrors,
} = require("./errors");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handleMongoErrors);
app.use(handleServerErrors);

module.exports = { app };
