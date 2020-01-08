const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const WorkoutExerciseSchema = new Schema({
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: 'Workout',
    required: true,
  },
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  time: {
    type: Number,
  }
});

module.exports = mongoose.model('WorkoutExercise', WorkoutExerciseSchema);
