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
  intensity: {
    type: String,
  },
  type: {
    type: String,
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
