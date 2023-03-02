const { postWaitingRoomUser } = require("../models/app-model");

/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  saveSessionAndPost(id, session, socket) {
    const sessionStoreUsername = socket.username
      ? socket.username
      : socket.fullName;
    postWaitingRoomUser(
      sessionStoreUsername,
      socket.sessionID,
      socket.avatar_url,
      socket.chatTopics,
      socket.connectionID,
      socket.talkingTo,
      socket.isWaiting,
      socket.isProfessional
    );

    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

module.exports = {
  InMemorySessionStore,
};
