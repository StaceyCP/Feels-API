const http = require("http");
const { app } = require("../app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { InMemorySessionStore } = require("./sessionStore");
const { InMemoryMessageStore } = require("./messageStore");
const {
  fetchWaitingRoomUsers,
  postWaitingRoomUser,
  fetchUser,
  fetchProfessional,
  postMessage,
  getAllMessages,
} = require("../models/app-model");
const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();
const { db } = require("../db/connection");

if (sessionStore.sessions.size === 0) {
  fetchWaitingRoomUsers().then((dbSessions) => {
    console.log("No sessions :'( ");
    for (const dbSession of dbSessions) {
      if (dbSession.isProfessional) {
        const sessionObj = {
          connectionID: dbSession.connectionID,
          fullName: dbSession.username,
          talkingTo: [dbSession.talkingTo].flat(Infinity),
          isProfessional: dbSession.isProfessional,
          avatar_url: dbSession.avatar_url,
        };
        sessionStore.saveSession(dbSession.sessionID, sessionObj);
      } else {
        sessionStore.saveSession(dbSession.sessionID, dbSession);
      }
    }
  });
}

if (messageStore.messages.length === 0) {
  getAllMessages().then((dbMessages) => {
    dbMessages.forEach((dbMessage) => {
      messageStore.saveMessage({
        message: dbMessage.message,
        from: dbMessage.from,
        to: dbMessage.to,
      });
    });
  });
}

app.get("/", (req, res) => {
  res.send("Feels API");
});

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log(sessionID, "HANDSHAKE ID");
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
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
        socket.chatTopics = session.chatTopics;
        console.log(session.username);
      }
      socket.connectionID = session.connectionID;
      socket.avatar_url = session.avatar_url;
      console.log(session.connectionID);
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  const fullName = socket.handshake.auth.fullName;
  const regNumber = socket.handshake.auth.regNumber;
  if (!username) {
    const proData = await fetchProfessional(regNumber);
    socket.talkingTo = [];
    socket.isProfessional = true;
    socket.fullName = fullName;
    socket.avatar_url = proData.avatarURL;
  } else if (!fullName) {
    const userData = await fetchUser(username);
    socket.isProfessional = false;
    socket.isWaiting = false;
    socket.talkingTo = null;
    socket.username = username;
    socket.avatar_url = userData.avatar_url;
    socket.chatTopics = "";
  }
  console.log("GIVING RANDOM IDS");
  socket.sessionID = Math.floor(Math.random() * 1000000000000000).toString();
  socket.connectionID = Math.floor(Math.random() * 1000000000000000).toString();
  next();
});

io.on("connection", async (socket) => {
  console.log("Successful connection");

  const sessionObj = socket.fullName
    ? {
        connectionID: socket.connectionID,
        fullName: socket.fullName,
        talkingTo: socket.talkingTo,
        avatar_url: socket.avatar_url,
        isProfessional: socket.isProfessional,
      }
    : {
        connectionID: socket.connectionID,
        username: socket.username,
        talkingTo: socket.talkingTo,
        isWaiting: socket.isWaiting,
        isProfessional: socket.isProfessional,
        chatTopics: socket.chatTopics,
        avatar_url: socket.avatar_url,
      };

  sessionStore.saveSessionAndPost(socket.sessionID, sessionObj, socket);

  console.log(sessionStore.findAllSessions());

  socket.emit("session", {
    sessionID: socket.sessionID,
    connectionID: socket.connectionID,
    talkingTo: socket.talkingTo,
    isWaiting: socket.isWaiting,
    isProfessional: socket.isProfessional,
  });

  socket.join(socket.connectionID);

  socket.on("addChat", (id) => {
    const currentChats = [...socket.talkingTo];
    currentChats.push(id);
    socket.talkingTo = currentChats;
    console.log(socket.talkingTo);
    sessionStore.saveSessionAndPost(
      socket.sessionID,
      {
        ...sessionObj,
        talkingTo: currentChats,
      },
      socket
    );
    const activeChats = sessionStore
      .findAllSessions()
      .filter((sess) => socket.talkingTo.includes(sess.connectionID));
    socket.emit("talkingTo", activeChats);
  });

  socket.on("getHelpChat", (chat) => {
    const specificMessages = messageStore
      .findMessagesForUser(socket.connectionID)
      .filter((message) => {
        return message.from === chat || message.to === chat;
      });
    socket.emit("oldMessages", specificMessages);
  });

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

  socket.on("message", ({ message, to }) => {
    const newMessage = { message, from: socket.connectionID, to };
    socket.to(to).to(socket.connectionID).emit("message", newMessage);
    messageStore.saveMessage(newMessage);
    postMessage(newMessage);
  });

  socket.on("waiting", () => {
    sessionStore.saveSessionAndPost(
      socket.sessionID,
      {
        ...sessionObj,
        isWaiting: true,
      },
      socket
    );
  });

  socket.on("matched", ({ from }) => {
    socket.talkingTo = from;
    sessionStore.saveSessionAndPost(
      socket.sessionID,
      {
        ...sessionObj,
        talkingTo: from,
      },
      socket
    );
  });

  socket.on("refresh", () => {
    const newUsers = [];
    sessionStore.findAllSessions().forEach((session) => {
      if (session.isProfessional || !session.isWaiting) return;
      newUsers.push({
        connectionID: session.connectionID,
        username: session.username,
        avatar_url: session.avatar_url,
        chatTopics: session.chatTopics,
      });
    });
    socket.emit("users", newUsers);
  });

  socket.on("getOldMessages", () => {
    socket.emit(
      "oldMessages",
      messageStore.findMessagesForUser(socket.connectionID)
    );
  });

  socket.on("getTalkingTo", () => {
    const activeChats = sessionStore
      .findAllSessions()
      .filter((sess) => socket.talkingTo.includes(sess.connectionID));
    socket.emit("talkingTo", activeChats);
  });
});

module.exports = { server };
