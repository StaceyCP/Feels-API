const { app } = require("./app");
const { db } = require("./db/connection");
const { server } = require("./socket/socket");
const { PORT = 9090 } = process.env;

// app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
server.listen(PORT, () => {
  console.log(`listening on port WS ${PORT}`);
});
