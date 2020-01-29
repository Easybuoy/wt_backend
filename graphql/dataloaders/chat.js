const DataLoader = require('dataloader');
const Chat = require('../../models/chat');

function chatDataLoader(chatIds) {
  const uniqueUsers = chatIds.reduce((users, userIds) => {
    userIds.forEach((id) => {
      if (!users.includes(id)) users.push(id);
    });
    return users;
  }, []);
  return Chat.find({
    sender: { $in: uniqueUsers },
    receiver: { $in: uniqueUsers }
  }).sort({ sent: 'asc' })
    .then((chats) => chatIds.map(
      (userIds) => chats.filter(
        ({ sender, receiver }) => userIds.includes(sender.toString())
          && userIds.includes(receiver.toString())
      )
    ));
}

function createChatDL(context) {
  const ctx = context;
  if (!ctx.chatDataLoader) {
    // eslint-disable-next-line no-use-before-define
    ctx.chatDataLoader = new DataLoader(exportFunctions.chatDataLoader);
  }
  return ctx.chatDataLoader;
}

// the use of this object facilitates dataloader testing / spy & mock functions
const exportFunctions = {
  chatDataLoader,
  createChatDL
};

module.exports = exportFunctions;
