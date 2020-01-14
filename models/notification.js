const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  topic: {
    type: String,
    require: true,
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
