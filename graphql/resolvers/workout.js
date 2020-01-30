const { GraphQLUpload } = require('graphql-upload');
const Workout = require('../../models/workout');
const WorkoutSession = require('../../models/workoutSession');
const { searchBy, uploadFile } = require('../../helpers/helpers');
const WorkoutExercises = require('../../models/workoutExercise');

const { createExerciseDL: ExerciseDataLoader } = require('../dataloaders/exercise');
const { createWorkoutSessionDL: WorkoutSessionDataLoader } = require('../dataloaders/workoutSession');

const exerciseDifficultyToInt = (difficulty) => {
  if (difficulty === 'Beginner') {
    return 1;
  }
  if (difficulty === 'Intermediate') {
    return 2;
  }
  return 3;
};

const exerciseTimeByWorkoutIntensity = (intensity) => {
  if (intensity === 'Low') return 20;
  if (intensity === 'Moderate') return 30;
  return 40; // high
};

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
    completedWorkoutsGallery: async () => WorkoutSession.find({ picture: { $ne: null } })
      .sort({ endDate: -1 }).populate('workoutId')
  },
  Mutation: {
    workoutSession: async (_, { input }, context) => {
      const {
        userId, workoutId, exerciseId, exerciseTimer, pause, end
      } = input;
      let workoutSession = await WorkoutSessionDataLoader(context).load({ userId, workoutId });
      if (typeof pause === 'undefined' && typeof end === 'undefined') {
        // start session
        if (workoutSession === null) {
          workoutSession = new WorkoutSession({
            userId,
            workoutId,
            exerciseId,
            exerciseTimer,
            startDate: Date.now(),
            pause: false,
            endDate: null,
            picture: null,
            weight: null
          });
          workoutSession = await workoutSession.save();
        } else {
          workoutSession = await WorkoutSession.findOneAndUpdate(
            { _id: workoutSession.id },
            {
              exerciseId,
              exerciseTimer,
              pause: false
            },
            { new: true }
          );
        }
      } else if (typeof end === 'undefined') {
        // pause session
        if (workoutSession && workoutSession._doc.pause !== pause) {
          workoutSession = await WorkoutSession.findOneAndUpdate(
            { _id: workoutSession.id },
            {
              exerciseId,
              exerciseTimer,
              pause
            },
            { new: true }
          );
        }
      } else if (workoutSession && workoutSession._doc.endDate === null) {
        // end session
        workoutSession = await WorkoutSession.findOneAndUpdate(
          { _id: workoutSession.id },
          {
            exerciseId,
            exerciseTimer,
            pause: true,
            endDate: Date.now()
          },
          { new: true }
        );
      }
      return workoutSession ? { ...workoutSession._doc, id: workoutSession.id } : null;
    },
    updateCompletedWorkout: async (_, { input: { sessionId, file, weight } }) => {
      try {
        // eslint-disable-next-line no-console
        console.log('received:', sessionId, file);
        const image = await uploadFile(file);
        return WorkoutSession.findOneAndUpdate(
          { _id: sessionId },
          { picture: image.url, weight },
          { new: true }
        );
      } catch (err) {
        throw new Error(err.message);
      }
    },
    customWorkout: async (_, { input }, context) => {
      const {
        name, description, workoutId, intensity, picture, exercises, remove
      } = input;
      try {
        let customWorkout = await Workout.findOne({ _id: workoutId });
        if (remove === true) {
          if (customWorkout) {
            await Workout.deleteOne({ _id: workoutId });
            return customWorkout;
          }
          throw new Error('The workout cannot be deleted because it doesn\'t exist!');
        }
        if (!customWorkout) {
          customWorkout = new Workout({
            userId: context.user.id,
            name,
            description,
            intensity,
            picture,
          });
          customWorkout = await customWorkout.save();
          const customWorkouExercises = exercises.map((exerciseId) => new WorkoutExercises({
            workoutId: customWorkout.id,
            exerciseId,
            time: exerciseTimeByWorkoutIntensity(customWorkout.intensity)
          }).save());
          await Promise.all(customWorkouExercises);
        } else {
          // List of exercises don't update immediately on response
          const workoutExercises = await ExerciseDataLoader(context).load(workoutId);
          const workoutExercisesIds = workoutExercises.map((we) => we.id.toString());

          const newConnections = exercises.filter(
            (exerciseId) => !workoutExercisesIds.includes(exerciseId)
          );
          const deletedConnections = workoutExercisesIds.filter(
            (exerciseId) => !exercises.includes(exerciseId)
          );

          await WorkoutExercises.deleteMany({ exerciseId: { $in: deletedConnections } });

          const newCustomWorkouExercises = newConnections.map(
            (exerciseId) => (new WorkoutExercises({
              workoutId,
              exerciseId,
              time: exerciseTimeByWorkoutIntensity(customWorkout.intensity)
            })).save()
          );
          await Promise.all(newCustomWorkouExercises);

          customWorkout = await Workout.findByIdAndUpdate(workoutId, {
            name,
            description,
            intensity,
            picture,
          }, { new: true });
        }
        return customWorkout;
      } catch (err) {
        throw new Error(err.message);
      }
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
      const workoutSession = await WorkoutSessionDataLoader(context).load({ userId, workoutId });
      if (workoutSession !== null) return { ...workoutSession._doc, id: workoutSession.id };
      return null;
    },
    types: async (workout, args, context) => {
      const workoutExercises = await ExerciseDataLoader(context).load(workout.id);
      const types = [];
      workoutExercises
        .forEach((exercise) => {
          if (exercise.type && !types.includes(exercise.type)) {
            types.push(exercise.type);
          }
        });
      return types.join(', ');
    },
    experience: async (workout, args, context) => {
      const workoutExercises = await ExerciseDataLoader(context).load(workout.id);
      const experience = workoutExercises.reduce(
        (total, exercise) => total + exerciseDifficultyToInt(exercise.difficulty), 0
      ) / workoutExercises.length;
      if (experience < 1.5) return 'Beginner';
      if (experience < 2.15) return 'Intermediate';
      return 'Expert';
    }
  },
  Upload: GraphQLUpload,
  WorkoutSession: {
    workoutId: async (session) => {
      const workout = await Workout.findById(session.workoutId);
      return { ...workout._doc, id: workout.id };
    }
  }
};
