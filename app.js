const apiRouter = require("./routes/apiRouter");
const express = require("express");
const {
  handleServerErrors,
  handleUsersErrors,
  handleValidationErrors,
} = require("./errors");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleUsersErrors);
app.use(handleValidationErrors);
app.use(handleServerErrors); // always at the bottom

module.exports = { app };
