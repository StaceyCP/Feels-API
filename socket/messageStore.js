class MessageStore {
  saveMessage(message) {}
  findMessagesForUsers(userID) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = [];
  }
  saveMessage(message) {
    this.messages.push(message);
  }
  findMessagesForUsers(userID) {
    return this.messages.filter(({ from, to }) => {
      return from === userID || to === userID;
    });
  }
}

module.exports = { InMemoryMessageStore };
