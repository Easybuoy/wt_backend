const Exercise = require('../../models/exercise');

module.exports = {
  Query: {
    exercises: async () => {
      const exercises = await Exercise.find();
      return exercises;
    }
  },
  Mutation: {}
};
