const http = require("http");

const { app } = require("../app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("Feels API");
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      if (!session.username) {
        socket.isProfessional = true;
        socket.fullName = session.fullName;
      } else if (!session.fullName) {
        socket.isProfessional = false;
        socket.isWaiting = false;
        socket.username = session.username;
      }
      socket.connectionID = session.connectionID;
      next();
    }
  }
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
  socket.sessionID = Math.floor(Math.random() * 1000000000000000);
  socket.connectionID = Math.floor(Math.random() * 1000000000000000);
  next();
});

io.on("connection", (socket) => {
  console.log("Successful connection");
  let users = [];
  for (let [id, socket] of io.of("/").sockets) {
    if (socket.isProfessional) {
      continue;
    }
    users.push(id);
  }

  socket.on("message", ({ message, to }) => {
    io.to(to).emit("message", { message, from: socket.id });
  });

  socket.on("waiting", () => {
    socket.isWaiting = true;
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
