const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  video: {
    type: String,
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
  rating: {
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
  name: {
    type: String,
    unique: true
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
