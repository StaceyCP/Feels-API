const apiRouter = require("./routes/apiRouter");
const express = require("express");
const { handleServerErrors, handleUsersErrors } = require("./errors");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleUsersErrors);
app.use(handleServerErrors);

module.exports = { app };
