const http = require("http");
const { app } = require("../app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { InMemorySessionStore } = require("./sessionStore");
const { InMemoryMessageStore } = require("./messageStore");
const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

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
        socket.talkingTo = session.talkingTo;
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
    socket.talkingTo = [];
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
    ? {
        connectionID: socket.connectionID,
        fullName: socket.fullName,
        talkingTo: socket.talkingTo,
      }
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

  socket.on("addChat", (id) => {
    const currentChats = socket.talkingTo;
    currentChats.push(id);
    sessionStore.saveSession(socket.sessionID, {
      ...sessionObj,
      talkingTo: currentChats,
    });
  });

  socket.on("getHelpChat", (chat) => {
    const specificMessages = messageStore
      .findMessagesForUser(socket.connectionID)
      .filter((message) => {
        return message.from === chat || message.to === chat;
      });
    socket.emit("oldMessages", specificMessages);
  });

  const users = [];
  const userMessages = new Map();
  messageStore.findMessagesForUser(socket.connectionID).forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.connectionID === from ? to : from;
    if (userMessages.has(otherUser)) {
      userMessages.get(otherUser).push(message);
    } else {
      userMessages.set(otherUser, [message]);
    }
  });

  sessionStore.findAllSessions().forEach((session) => {
    users.push(session.connectionID);
  });
  socket.on("getOldMessages", () => {
    socket.emit(
      "oldMessages",
      messageStore.findMessagesForUser(socket.connectionID)
    );
  });

  console.log(messageStore.findMessagesForUser(socket.connectionID));

  socket.on("message", ({ message, to }) => {
    const newMessage = { message, from: socket.connectionID, to };
    socket.to(to).to(socket.connectionID).emit("message", newMessage);
    messageStore.saveMessage(newMessage);
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
      newUsers.push(socket.connectionID);
    }
    socket.emit("users", newUsers);
  });

  socket.emit("users", users);
});

server.listen({ host: "192.168.1.70", port: 9999 }, () => {
  console.log("listening on port 9999");
});
