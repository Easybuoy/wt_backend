const Workout = require('../../models/workout');
const WorkoutSession = require('../../models/workoutSession');
const { searchBy } = require('../../helpers/helpers');
const { createExerciseDL: ExerciseDataLoader } = require('../dataloaders/exercise');

module.exports = {
  Query: {
    workouts: async (_, { input }) => {
      const workouts = await Workout.find(searchBy(input));
      return workouts;
    },
    workout: async (_, { id }) => {
      const workout = await Workout.findById(id);
      return { ...workout._doc, id: workout.id };
    },
    completedWorkouts: async (_, args, context) => WorkoutSession.find({ userId: context.user.id, endDate: { $ne: null } }).sort({ endDate: -1 }).populate('workoutId'),
  },
  Mutation: {
    workoutSession: async (_, { input }) => {
      const {
        userId, workoutId, pause, end
      } = input;
      let workoutSession = await WorkoutSession.findOne({ userId, workoutId, endDate: null });
      if (typeof pause === 'undefined' && typeof end === 'undefined') {
        // start session
        if (workoutSession === null) {
          workoutSession = new WorkoutSession({
            userId,
            workoutId,
            startDate: Date.now(),
            pause: false,
            endDate: null,
          });
          workoutSession = await workoutSession.save();
        }
      } else if (typeof end === 'undefined') {
        // pause session
        if (workoutSession && workoutSession._doc.pause !== pause) {
          workoutSession = await WorkoutSession.findOneAndUpdate(
            { userId, workoutId, endDate: null },
            { pause },
            { new: true }
          );
        }
      } else if (workoutSession && workoutSession._doc.endDate === null) {
        // end session
        workoutSession = await WorkoutSession.findOneAndUpdate(
          { userId, workoutId, endDate: null },
          { pause: true, endDate: Date.now() },
          { new: true }
        );
      }
      return workoutSession ? { ...workoutSession._doc, id: workoutSession.id } : null;
    }
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
    session: async (workout, args, context) => {
      const userId = context.user.id;
      const workoutId = workout.id;
      const workoutSession = await WorkoutSession.findOne({ userId, workoutId, endDate: null });
      if (workoutSession !== null) {
        return { ...workoutSession._doc, id: workoutSession.id };
      }
      return null;
    },
    types: async (workout, args, context) => {
      const workoutExercises = await ExerciseDataLoader(context).load(workout.id);
      const types = [];
      workoutExercises
        .forEach((exercise) => {
          if (exercise.type && !types.includes(exercise.muscle)) {
            types.push(exercise.type);
          }
        });
      return types.join(', ');
    },
  }
};
