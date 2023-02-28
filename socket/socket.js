const http = require("http");

const { app } = require("../app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("Feels API");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push(id);
  }
  console.log(socket.id);
  socket.on("message", ({ message, recipient }) => {
    socket.to(recipient).emit("message", { message, from: socket.id });
    console.log(message, recipient);
  });
  socket.emit("users", users);
});

server.listen({ host: "192.168.1.70", port: 9999 }, () => {
  console.log("listening on port 9999");
});
