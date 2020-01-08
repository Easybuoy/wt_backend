const Workout = require('../../models/workout');
const { createExerciseDL: ExerciseDataLoader } = require('../dataloaders/exercise');

module.exports = {
  Query: {
    workouts: async () => {
      const workouts = await Workout.find();
      return workouts;
    },
    workout: async (_, { id }) => {
      const workout = await Workout.findById(id);
      return { ...workout._doc, id: workout.id };
    }
  },
  Mutation: {

  },
  Workout: {
    exercises: (workout, args, context) => ExerciseDataLoader(context).load(workout.id),
    avgTime: async (workout, args, context) => {
      const workoutExercises = await ExerciseDataLoader(context).load(workout.id);
      const totalSeconds = workoutExercises.reduce((time, ex) => time + ex.time, 0);
      const minutes = (Math.floor(totalSeconds / 60)).toString().padStart(2, '0');
      const seconds = (totalSeconds % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    },
    equipment: async (workout, args, context) => {
      const workoutExercises = await ExerciseDataLoader(context).load(workout.id);
      const equipment = [];
      workoutExercises.forEach((exercise) => {
        if (exercise.equipment && !equipment.includes(exercise.equipment)) {
          equipment.push(exercise.equipment);
        }
      });
      return equipment.join(', ');
    },
    muscles: async (workout, args, context) => {
      const workoutExercises = await ExerciseDataLoader(context).load(workout.id);
      const muscles = [];
      workoutExercises
        .forEach((exercise) => {
          if (exercise.muscle && !muscles.includes(exercise.muscle)) {
            muscles.push(exercise.muscle);
          }
        });
      return muscles.join(', ');
    },
  }
};
