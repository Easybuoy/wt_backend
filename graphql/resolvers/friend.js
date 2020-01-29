const { withFilter } = require('apollo-server-express');
const User = require('../../models/user');
const Friend = require('../../models/friend');
const Chat = require('../../models/chat');
const { FRIEND_REQUEST, searchBy } = require('../../helpers/helpers');
const { createChatDL: ChatDataLoader } = require('../dataloaders/chat');

const {
  Mutation: { pushNotification }
} = require('./schedule');

const friendRequests = async (_, args, context) => {
  const currUser = context.user.id;
  const friendReqs = await Friend.find(
    {
      receiver: currUser,
      accepted: null
    },
  ).populate('sender');
  return friendReqs.map((friendRequest) => friendRequest.sender);
};

const friendChat = async (_, { receiver }, context) => ChatDataLoader(context)
  .load([receiver, context.user.id]);

module.exports = {
  Query: {
    findFriends: async (_, { input }, context) => {
      // list of friend ids
      let friends = await Friend.find(
        {
          $or: [
            { receiver: context.user.id },
            { sender: context.user.id },
          ],
          accepted: true
        },
      );
      friends = friends.map((fr) => (
        fr.sender === context.user.id ? fr.receiver.toString() : fr.sender.toString()
      ));
      // list of friend requests
      let friendReqs = await friendRequests(null, null, context);
      friendReqs = friendReqs.map((fr) => fr.id);
      // if not searching anything
      if (!input.search) {
        const currUser = await User.findById(context.user.id);
        // send suggestions without referring to friends, friend requests or the user itself
        const suggestedFriends = await User.find({
          goal: currUser.goal,
          _id: { $nin: [context.user.id, ...friends, ...friendReqs] }
        });
        return suggestedFriends;
      }
      return User.find(searchBy(input, { _id: { $nin: [context.user.id, ...friends] } }));
    },
    friends: async (_, args, context) => {
      const currUser = context.user.id;
      let friends = await Friend.find(
        {
          $or: [
            { receiver: currUser },
            { sender: currUser },
          ],
          accepted: true
        },
      ).populate('sender').populate('receiver');
      const friendsMessages = await Promise.all(
        friends.map((fr) => friendChat(_, {
          receiver: (fr.sender.id === currUser ? fr.receiver.id : fr.sender.id)
        }, context))
      );
      friends = friends.map((fr, i) => {
        const user = (fr.sender.id === currUser ? fr.receiver : fr.sender);
        return {
          ...user._doc,
          id: user.id,
          messages: friendsMessages[i],
        };
      });
      friends.sort((f1, f2) => {
        const newestF1Message = f1.messages[f1.messages.length - 1];
        const newestF2Message = f2.messages[f2.messages.length - 1];
        if (!newestF1Message) return 1;
        if (!newestF2Message) return -1;
        if (newestF1Message.sent > newestF2Message.sent) return 1;
        if (newestF1Message.sent < newestF2Message.sent) return -1;
        return 0;
      });
      return friends;
    },
    friendRequests,
    friendChat
  },
  Mutation: {
    manageFriends: async (_, { userId, task }, context) => {
      const currUser = context.user.id;
      const user = await User.findById(currUser);
      let res = false;
      if (task === 'add') {
        const friendRequest = await Friend.findOne({
          sender: { $in: [currUser, userId] },
          receiver: { $in: [currUser, userId] }
        });
        if (friendRequest) return false;
        let newFriend = new Friend({
          sender: currUser,
          receiver: userId
        });
        newFriend = await newFriend.save();
        await pushNotification(_, {
          input: {
            userId,
            message: `${user.firstname} ${user.lastname} just sent you a friend request!`,
            topic: 'Trackdrills - New Friend Request',
            subscription: FRIEND_REQUEST
          }
        }, context);
        res = newFriend !== null;
      } else if (task.includes('response')) {
        const userAnswer = Boolean(Number(task.split('_')[1]));
        const friendRequest = await Friend.findOneAndUpdate(
          {
            receiver: currUser,
            sender: userId,
            accepted: null
          },
          {
            accepted: userAnswer
          },
          {
            new: true
          }
        );
        if (friendRequest && friendRequest.accepted) {
          await pushNotification(_, {
            input: {
              userId,
              message: `${user.firstname} ${user.lastname} accepted your friend request!`,
              topic: 'Trackdrills - You have a new friend!',
              subscription: FRIEND_REQUEST
            }
          }, context);
        }
        res = friendRequest && friendRequest.accepted === userAnswer;
      } else if (task === 'remove') {
        const deleteFriend = await Friend.findOneAndDelete({
          receiver: { $in: [currUser, userId] },
          sender: { $in: [currUser, userId] }
        });
        res = deleteFriend && deleteFriend.id;
      }
      return res;
    },
    sendMessage: async (_, { receiver, message }, { user, pubsub }) => {
      const sender = user.id;
      const newMessage = await (new Chat({
        sender,
        receiver,
        message,
        sent: Date.now()
      })).save();
      pubsub.publish('CHAT_CHANNEL', { newMessage });
      return newMessage;
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, args, { pubsub }) => pubsub.asyncIterator('CHAT_CHANNEL'),
        ({ newMessage }, { receiver }) => newMessage.receiver.toString() === receiver
      )
    }
  },
  /* User: {
    messages: async (user, args, context) => friendChat(null, { receiver: user.id }, context)
  } */
};
