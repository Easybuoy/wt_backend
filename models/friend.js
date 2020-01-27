const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const FriendSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  accepted: {
    type: Boolean,
    default: null
  }
});

module.exports = mongoose.model('Friend', FriendSchema);
