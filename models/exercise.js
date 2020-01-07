const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  video: {
    type: String
  },
  difficulty: {
    type: String
  },
  picture_one: {
    type: String
  },
  picture_two: {
    type: String
  },
  exercise_ratings: {
    type: Number
  },
  equipment: {
    type: String
  },
  type: {
    type: String
  },
  muscle: {
    type: String
  },
  exercise_name: {
    type: String
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
