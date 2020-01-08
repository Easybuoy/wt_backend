const Exercise = require('../../models/exercise');
const { searchBy } = require('../../helpers/helpers');

module.exports = {
  Query: {
    exercises: async (_, { input }) => {
      const exercises = await Exercise.find(searchBy(input));
      return exercises;
    }
  },
  Mutation: {}
};
