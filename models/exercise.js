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
  pictureOne: {
    type: String
  },
  pictureTwo: {
    type: String
  },
  exerciseRatings: {
    type: String
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
  exerciseName: {
    type: String
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
