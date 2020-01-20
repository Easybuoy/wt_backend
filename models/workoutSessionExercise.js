const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const WorkoutSessionExerciseSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'WorkoutSession',
    required: true
  },
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  reps: {
    type: Number
  },
  sets: {
    type: Number
  },
  amountLifted: {
    type: Number
  }
});

module.exports = mongoose.model(
  'WorkoutSessionExercise',
  WorkoutSessionExerciseSchema
);
