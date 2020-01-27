const User = require('../../models/user');
const Friend = require('../../models/friend');
const { FRIEND_REQUEST } = require('../../helpers/helpers');
const { Mutation: { pushNotification } } = require('./schedule');

module.exports = {
  Query: {
    /*
    friends: async (_, args, context) => {

    },
    friendRequests: async (_, args, context) => {

    },
    */
  },
  Mutation: {
    manageFriends: async (_, { userId, task }, context) => {
      const currUser = context.user.id;
      const user = await User.findById(currUser);
      let res = false;
      if (task === 'add') {
        let newFriend = new Friend({
          sender: currUser,
          receiver: userId,
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
        const friendRequest = await Friend.findOneAndUpdate({
          receiver: currUser,
          sender: userId,
          accepted: null,
        }, {
          accepted: userAnswer
        }, {
          new: true
        });
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
      } else {
        // remove friend
      }
      return res;
    },
  }
};
