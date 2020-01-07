const Workout = require('../../models/workout');

module.exports = {
  Query: {
    workouts: async () => {
      const workouts = await Workout.find();
      return workouts;
    }
  },
  Mutation: {

  }
};
