const Exercise = require('../../models/exercise');

module.exports = {
  Query: {
    exercises: async () => {
      const exercises = await Exercise.find();
      return exercises;
    },
    exercise: async (_, { id }) => {
      const exercise = await Exercise.findById(id);
      return { ...exercise._doc, id: exercise.id };
    }
  },
  Mutation: {}
};
