const Exercise = require('../../models/exercise');
const { searchBy } = require('../../helpers/helpers');

module.exports = {
  Query: {
    exercises: async (_, { input }) => {
      const exercises = await Exercise.find(searchBy(input));
      return exercises;
    },
    exercise: async (_, { id }) => {
      const exercise = await Exercise.findById(id);
      return { ...exercise._doc, id: exercise.id };
    }
  },
  Mutation: {}
};
