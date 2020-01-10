/* eslint-disable no-console */
const { removeAllCollections } = require('./helpers');
const connect = require('../api/database');
const { isProduction } = require('../config');
const User = require('../models/user');
const Unit = require('../models/unit');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const WorkoutExercise = require('../models/workoutExercise');
const WorkoutSessions = require('../models/workoutSession');

const exerciseTimeByWorkoutIntensity = (intensity) => {
  if (intensity === 'Low') return 20;
  if (intensity === 'Moderate') return 30;
  return 40; // high
};
module.exports = async (onEnd = false) => {
  console.log('Connecting to database...');
  await connect;
  console.log('Clearing data from all collections...');
  await removeAllCollections(isProduction ? ['users'] : []);
  const usersData = [
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
  const unitsData = [
    { name: 'kg', type: 'weight' },
    { name: 'pounds', type: 'weight' },
    { name: 'inches', type: 'height' },
    { name: 'centimetres', type: 'height' }
  ];
  // eslint-disable-next-line global-require
  const exercisesData = require('./exercise');
  const workoutsData = [
    {
      userId: null,
      name: 'Chest and Shoulder Smackdown',
      description: 'Use this in place of your regular chest-and-delt workout if you\'re in lean-out mode. While it\'s more like a standard muscle-building training routine, you\'ll rev up the fat-burn a bit when you keep your rest periods under 30 seconds.',
      picture: 'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-4-700xh.jpg',
      intensity: 'Low',
    },
    {
      userId: null,
      name: 'Full-Body Circuit',
      description: 'This workout will get you moving in multiple directions. It\'s not about focusing on one body part, it\'s about getting everything moving and working together to burn calories while building up strength endurance.',
      picture: 'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-2-700xh.jpg',
      intensity: 'Moderate',
    },
    {
      userId: null,
      name: 'Arm-Blast',
      description: 'Biceps, triceps, and forearms are smaller body parts, but you can still bump up your metabolism if you\'re lifting hard and pushing on your rest periods. Keep your rest to 30-60 seconds between sets.',
      picture: 'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-3-700xh.jpg',
      intensity: 'High',
    },
    {
      userId: null,
      name: 'Back, Traps, And Core Routine',
      description: 'The back and core work synergistically, making them a good, dynamic muscle pairing for a high-energy-burn weight-training session. This workout is front-loaded with four back-focused supersets. Then, you\'ll switch and do traps and abs in a superset to wrap it up.',
      picture: 'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-1-700xh.jpg',
      intensity: 'Low',
    },
    {
      userId: null,
      name: 'Lower-Body Blast',
      description: 'The glutes and hamstrings are often a trouble spot for women, but guys can benefit from this workout, too.',
      picture: 'https://www.bodybuilding.com/exercises/exerciseImages/sequences/4361/Female/l/4361_2.jpg',
      intensity: 'Moderate',
    }
  ];
  try {
    let users;
    if (!isProduction) {
      console.log('Seeding users collection...');
      users = await User.create(usersData);
    } else {
      users = await User.find();
    }
    console.log('Seeding units collection...');
    await Unit.create(unitsData);
    console.log('Seeding exercises collection...');
    const exercises = await Exercise.insertMany(
      exercisesData.map((exercise) => {
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
    const workouts = await Workout.create(workoutsData);
    console.log('Seeding workout_exercises collection...');
    const workoutExercisesData = [
      {
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        time: exerciseTimeByWorkoutIntensity(workouts[0].intensity)
      },
      {
        workoutId: workouts[0].id,
        exerciseId: exercises[1].id,
        time: exerciseTimeByWorkoutIntensity(workouts[0].intensity)
      },
      {
        workoutId: workouts[0].id,
        exerciseId: exercises[2].id,
        time: exerciseTimeByWorkoutIntensity(workouts[0].intensity)
      },
      {
        workoutId: workouts[1].id,
        exerciseId: exercises[3].id,
        time: exerciseTimeByWorkoutIntensity(workouts[1].intensity)
      },
      {
        workoutId: workouts[1].id,
        exerciseId: exercises[4].id,
        time: exerciseTimeByWorkoutIntensity(workouts[1].intensity)
      },
      {
        workoutId: workouts[1].id,
        exerciseId: exercises[5].id,
        time: exerciseTimeByWorkoutIntensity(workouts[1].intensity)
      },
      {
        workoutId: workouts[2].id,
        exerciseId: exercises[2].id,
        time: exerciseTimeByWorkoutIntensity(workouts[2].intensity)
      },
      {
        workoutId: workouts[2].id,
        exerciseId: exercises[4].id,
        time: exerciseTimeByWorkoutIntensity(workouts[2].intensity)
      },
      {
        workoutId: workouts[2].id,
        exerciseId: exercises[6].id,
        time: exerciseTimeByWorkoutIntensity(workouts[2].intensity)
      },
      {
        workoutId: workouts[3].id,
        exerciseId: exercises[1].id,
        time: exerciseTimeByWorkoutIntensity(workouts[3].intensity)
      },
      {
        workoutId: workouts[3].id,
        exerciseId: exercises[3].id,
        time: exerciseTimeByWorkoutIntensity(workouts[3].intensity)
      },
      {
        workoutId: workouts[3].id,
        exerciseId: exercises[7].id,
        time: exerciseTimeByWorkoutIntensity(workouts[3].intensity)
      },
      {
        workoutId: workouts[4].id,
        exerciseId: exercises[3].id,
        time: exerciseTimeByWorkoutIntensity(workouts[4].intensity)
      },
      {
        workoutId: workouts[4].id,
        exerciseId: exercises[4].id,
        time: exerciseTimeByWorkoutIntensity(workouts[4].intensity)
      },
      {
        workoutId: workouts[4].id,
        exerciseId: exercises[8].id,
        time: exerciseTimeByWorkoutIntensity(workouts[4].intensity)
      }
    ];
    await WorkoutExercise.insertMany(workoutExercisesData);
    const workoutSessionsData = [
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        startDate: Date.now(),
        endDate: Date.now() + 1,
        pause: false
      },
      {
        userId: users[0].id,
        workoutId: workouts[1].id,
        startDate: Date.now(),
        endDate: Date.now() + 1,
        pause: false
      },
      {
        userId: users[0].id,
        workoutId: workouts[2].id,
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[0].id,
        workoutId: workouts[3].id,
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[1].id,
        workoutId: workouts[0].id,
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[1].id,
        workoutId: workouts[1].id,
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[1].id,
        workoutId: workouts[2].id,
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[2].id,
        workoutId: workouts[0].id,
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[2].id,
        workoutId: workouts[1].id,
        startDate: Date.now(),
        endDate: null,
        pause: false
      }
    ];
    await WorkoutSessions.insertMany(workoutSessionsData);
  } catch (err) {
    if (err.message.includes('ns not found')) return false;
    throw new Error(err.message);
  }
  console.log('Successfully seeded the database!');
  return onEnd ? onEnd() : true;
};
