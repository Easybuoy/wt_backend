const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  topic: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
    default: 'notification'
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
