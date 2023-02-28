const http = require("http");

const { app } = require("../app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("Feels API");
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const fullName = socket.handshake.auth.fullName;
  if (!username) {
    socket.isProfessional = true;
    socket.fullName = fullName;
  } else if (!fullName) {
    socket.isProfessional = false;
    socket.isWaiting = false;
    socket.username = username;
  }
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");
  let users = [];
  for (let [id, socket] of io.of("/").sockets) {
    if (socket.isProfessional) {
      continue;
    }
    users.push(id);
  }
  console.log(socket.id);
  socket.on("message", ({ message, to }) => {
    io.to(to).emit("message", { message, from: socket.id });
  });
  socket.on("waiting", () => {
    socket.isWaiting = true;
    console.log(socket.isWaiting);
  });
  socket.on("refresh", () => {
    const newUsers = [];
    for (let [id, socket] of io.of("/").sockets) {
      if (socket.isProfessional || !socket.isWaiting) continue;
      newUsers.push(id);
    }
    socket.emit("users", newUsers);
  });
  socket.emit("users", users);
});

server.listen({ host: "192.168.1.70", port: 9999 }, () => {
  console.log("listening on port 9999");
});
