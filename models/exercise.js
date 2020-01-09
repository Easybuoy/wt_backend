const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  description: {
    type: String,
  },
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
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
