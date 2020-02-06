const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const ChatSchema = new Schema({
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
  message: {
    type: String,
    require: true,
  },
  sent: {
    type: Number,
    default: Date.now(),
    require: true,
  }
});

module.exports = mongoose.model('Chat', ChatSchema);
