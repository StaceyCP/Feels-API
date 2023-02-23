const cors = require("cors");
const apiRouter = require("./routes/apiRouter");
const express = require("express");
const {
  handleServerErrors,
  handleMongoErrors,
  handleCustomErrors,
  handleUsersErrors,
  handleValidationErrors,
} = require("./errors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use(handleCustomErrors);
app.use(handleMongoErrors);
app.use(handleValidationErrors);
app.use(handleServerErrors); // always at the bottom

module.exports = { app };
