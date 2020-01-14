const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const WorkoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  picture: {
    type: String
  },
  intensity: {
    type: String,
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
