const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const LogSchema = new Schema({
  topic: {
    type: String,
    require: true
  },
  message: {
    type: String,
    require: true
  },
  file: {
    type: String,
    require: true
  },
  dateTime: {
    type: Number,
    require: true,
    default: Date.now()
  }
});

module.exports = mongoose.model('Log', LogSchema);
