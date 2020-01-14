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
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    default: null,
  },
  exerciseTimer: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Number,
  },
  endDate: {
    type: Number,
  },
  pause: {
    type: Boolean,
  },
  picture: {
    type: String
  }
});

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);
