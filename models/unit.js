const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const UnitSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  type: {
    type: String,
    require: true,
  }
});

module.exports = mongoose.model('Unit', UnitSchema);
