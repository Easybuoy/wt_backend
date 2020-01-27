const User = require('../../models/user');
const Friend = require('../../models/friend');
const { FRIEND_REQUEST, searchBy } = require('../../helpers/helpers');
const {
  Mutation: { pushNotification }
} = require('./schedule');

module.exports = {
  Query: {
    findFriends: async (_, { input }, context) => {
      let friends = await Friend.find(
        {
          $or: [
            { receiver: context.user.id },
            { sender: context.user.id },
          ],
          accepted: true
        },
      );
      friends = friends.map((fr) => (fr.sender === context.user.id ? fr.receiver : fr.sender));
      if (!input.search) {
        const currUser = await User.findById(context.user.id);
        const suggestedFriends = await User.find({
          goal: currUser.goal,
          _id: { $nin: [context.user.id, ...friends] }
        });
        return suggestedFriends;
      }
      return User.find(searchBy(input, { _id: { $nin: [context.user.id, ...friends] } }));
    },
    friends: async (_, args, context) => {
      const currUser = context.user.id;
      const friends = await Friend.find(
        {
          $or: [
            { receiver: currUser },
            { sender: currUser },
          ],
          accepted: true
        },
      ).populate('sender').populate('receiver');
      return friends.map((fr) => (fr.sender.id === currUser ? fr.receiver : fr.sender));
    },
    friendRequests: async (_, args, context) => {
      const currUser = context.user.id;
      const friendRequests = await Friend.find(
        {
          receiver: currUser,
          accepted: null
        },
      ).populate('sender');
      return friendRequests.map((friendRequest) => friendRequest.sender);
    },
  },
  Mutation: {
    manageFriends: async (_, { userId, task }, context) => {
      const currUser = context.user.id;
      const user = await User.findById(currUser);
      let res = false;
      if (task === 'add') {
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
        });
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
          });
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
    }
  }
};
