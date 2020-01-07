/* eslint-disable no-console */
const { removeAllCollections } = require('./helpers');
const connect = require('../api/database');
const { isProduction } = require('../config');
const User = require('../models/user');
const Unit = require('../models/unit');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const WorkoutExercise = require('../models/workoutExercise');

module.exports = async (onEnd = false) => {
  console.log('Connecting to database...');
  await connect;
  console.log('Clearing data from all collections...');
  await removeAllCollections(isProduction ? ['users'] : []);

  const users = [
    {
      firstname: 'Test',
      lastname: 'User 1',
      email: 'test@user1.com',
      password: 'testUser1!'
    },
    {
      firstname: 'Test',
      lastname: 'User 2',
      email: 'test@user2.com',
      password: 'testUser2!'
    },
    {
      firstname: 'Test',
      lastname: 'User 3',
      email: 'test@user3.com',
      password: 'testUser3!'
    }
  ];

  const units = [
    { name: 'kg', type: 'weight' },
    { name: 'pounds', type: 'weight' },
    { name: 'inches', type: 'height' },
    { name: 'centimetres', type: 'height' }
  ];

  // eslint-disable-next-line global-require
  const exercises = require('./exercise');

  const workouts = [
    {
      userId: null,
      name: 'Chest and Shoulder Smackdown',
      description: 'Use this in place of your regular chest-and-delt workout if you\'re in lean-out mode. While it\'s more like a standard muscle-building training routine, you\'ll rev up the fat-burn a bit when you keep your rest periods under 30 seconds.',
      picture: 'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-4-700xh.jpg',
      intensity: '',
      type: '',
    }
  ];

  if (!isProduction) {
    console.log('Seeding users collection...');
    await User.create(users);
  }
  console.log('Seeding units collection...');
  await Unit.create(units);

  console.log('Seeding exercises collection...');
  await Exercise.create(
    exercises.map((exercise) => {
      const exerciseCopy = { ...exercise };
      [
        ['picture_one', 'pictureOne'],
        ['picture_two', 'pictureTwo'],
        ['exercise_ratings', 'rating'],
        ['exercise_name', 'name'],
      ].forEach(([oldField, newField]) => {
        delete exerciseCopy[oldField];
        exerciseCopy[newField] = exercise[oldField];
      });
      if (['Body Only', 'Other'].includes(exerciseCopy.equipment)) {
        exerciseCopy.equipment = null;
      }
      if (exerciseCopy.rating === 'n/a') {
        exerciseCopy.rating = null;
      }
      return exerciseCopy;
    })
  );

  console.log('Seeding workouts collection...');
  await Workout.create(workouts);

  console.log('Seeding workout_exercises collection...');
  const workoutExercises = [
    {
      workoutId: (await Workout.findOne()).id,
      exerciseId: (await Exercise.findOne({ muscle: 'Chest' })).id,
      time: 30
    },
    {
      workoutId: (await Workout.findOne()).id,
      exerciseId: (await Exercise.findOne({ muscle: 'Lats' })).id,
      time: 30
    }
  ];
  await WorkoutExercise.create(workoutExercises);

  console.log('Successfully seeded the database!');
  return onEnd ? onEnd() : true;
};
