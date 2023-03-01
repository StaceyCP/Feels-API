const http = require("http");
const { app } = require("../app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

app.get("/", (req, res) => {
  res.send("Feels API");
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log(sessionID, "HANDSHAKE ID");
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    console.log(session, "SESSION STORE");
    if (session) {
      console.log("HERE2");
      socket.sessionID = sessionID;
      if (!session.username) {
        socket.isProfessional = true;
        socket.fullName = session.fullName;
      } else if (!session.fullName) {
        socket.isProfessional = false;
        socket.isWaiting = session.isWaiting;
        socket.talkingTo = session.talkingTo;
        socket.username = session.username;
        console.log(session.username);
      }
      socket.connectionID = session.connectionID;
      console.log(session.connectionID);
      return next();
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
    socket.talkingTo = null;
    socket.username = username;
  }
  console.log("GIVING RANDOM IDS");
  socket.sessionID = Math.floor(Math.random() * 1000000000000000).toString();
  socket.connectionID = Math.floor(Math.random() * 1000000000000000).toString();
  next();
});

io.on("connection", (socket) => {
  console.log("Successful connection");

  const sessionObj = socket.fullName
    ? { connectionID: socket.connectionID, fullName: socket.fullName }
    : {
        connectionID: socket.connectionID,
        username: socket.username,
        talkingTo: socket.talkingTo,
        isWaiting: socket.isWaiting,
        isProfessional: socket.isProfessional,
      };

  console.log(socket.sessionID, "In Listener");
  sessionStore.saveSession(socket.sessionID, sessionObj);
  console.log(sessionStore.findAllSessions());

  socket.emit("session", {
    sessionID: socket.sessionID,
    connectionID: socket.connectionID,
    talkingTo: socket.talkingTo,
    isWaiting: socket.isWaiting,
  });

  socket.join(socket.connectionID);

  let users = [];
  for (let [id, socket] of io.of("/").sockets) {
    if (socket.isProfessional) {
      continue;
    }
    users.push(id);
  }

  socket.on("message", ({ message, to }) => {
    socket
      .to(to)
      .to(socket.connectionID)
      .emit("message", { message, from: socket.connectionID });
  });

  socket.on("waiting", () => {
    socket.isWaiting = true;
  });

  socket.on("matched", ({ from }) => {
    sessionStore.saveSession(socket.sessionID, {
      ...sessionObj,
      talkingTo: from,
    });
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

server.listen({ host: "192.168.0.23", port: 9999 }, () => {
  console.log("listening on port 9999");
});
