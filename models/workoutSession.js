const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const WorkoutSessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: 'Workout',
    required: true,
  },
  startDate: {
    type: Number,
  },
  endDate: {
    type: Number,
  },
  pause: {
    type: Boolean,
  }
});

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);
