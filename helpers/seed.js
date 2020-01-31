/* eslint-disable no-console */
const { removeAllCollections } = require('./helpers');
const connect = require('../api/database');
// eslint-disable-next-line no-unused-vars
const { isProduction } = require('../config');
const User = require('../models/user');
const Unit = require('../models/unit');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const WorkoutExercise = require('../models/workoutExercise');
const WorkoutSession = require('../models/workoutSession');
const Schedule = require('../models/schedule');
const WorkoutSessionExercise = require('../models/workoutSessionExercise');

const exerciseTimeByWorkoutIntensity = (intensity) => {
  if (intensity === 'Low') return 20;
  if (intensity === 'Moderate') return 30;
  return 40; // high
};

const newDate = (days = 0) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.getTime();
};

module.exports = async (onEnd = false) => {
  const unitsData = [
    { name: 'kg', type: 'weight' },
    { name: 'pounds', type: 'weight' },
    { name: 'inches', type: 'height' },
    { name: 'metres', type: 'height' }
  ];
  // eslint-disable-next-line global-require
  const exercisesData = require('./exercise');
  const workoutsData = [
    {
      userId: null,
      name: 'Chest and Shoulder Smackdown',
      description:
        "Use this in place of your regular chest-and-delt workout if you're in lean-out mode. While it's more like a standard muscle-building training routine, you'll rev up the fat-burn a bit when you keep your rest periods under 30 seconds.",
      picture:
        'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-4-700xh.jpg',
      intensity: 'Low'
    },
    {
      userId: null,
      name: 'Full-Body Circuit',
      description:
        "This workout will get you moving in multiple directions. It's not about focusing on one body part, it's about getting everything moving and working together to burn calories while building up strength endurance.",
      picture:
        'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-2-700xh.jpg',
      intensity: 'Moderate'
    },
    {
      userId: null,
      name: 'Arm-Blast',
      description:
        "Biceps, triceps, and forearms are smaller body parts, but you can still bump up your metabolism if you're lifting hard and pushing on your rest periods. Keep your rest to 30-60 seconds between sets.",
      picture:
        'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-3-700xh.jpg',
      intensity: 'High'
    },
    {
      userId: null,
      name: 'Back, Traps, And Core Routine',
      description:
        "The back and core work synergistically, making them a good, dynamic muscle pairing for a high-energy-burn weight-training session. This workout is front-loaded with four back-focused supersets. Then, you'll switch and do traps and abs in a superset to wrap it up.",
      picture:
        'https://www.bodybuilding.com/images/2018/april/5-workous-that-are-insanely-efficient-at-torching-fat-signature-1-700xh.jpg',
      intensity: 'Low'
    },
    {
      userId: null,
      name: 'Lower-Body Blast',
      description:
        'The glutes and hamstrings are often a trouble spot for women, but guys can benefit from this workout, too.',
      picture:
        'https://www.bodybuilding.com/exercises/exerciseImages/sequences/4361/Female/l/4361_2.jpg',
      intensity: 'Moderate'
    },
    {
      userId: null,
      name: 'Upper-Chest',
      description:
        'If you want to sport a powerful, thick, and full chest, then you have to start at the top. In other words, make your upper pecs the top priority.',
      picture:
        'https://www.bodybuilding.com/images/2018/april/upper-chest-training-made-simple-header-muscletech-400x225.jpg',
      intensity: 'High'
    },
    {
      userId: null,
      name: 'Biceps, Triceps and Calves',
      description:
        'This is a workout that allows for a great deal of flexibility on your part with overall structural design',
      picture:
        'https://www.bodybuilding.com/exercises/exerciseImages/sequences/147/Male/100sq/147_2.jpg',
      intensity: 'Moderate'
    },
    {
      userId: null,
      name: 'Chest and Triceps',
      description:
        'This is a workout that allows for a great deal of flexibility on your part with overall structural design',
      picture:
        'https://www.bodybuilding.com/exercises/exerciseImages/sequences/380/Male/100sq/380_2.jpg',
      intensity: 'Low'
    },
    {
      userId: null,
      name: 'Upper Chest and Biceps',
      description:
        'This workout will get you moving in multiple directions. It\'s not about focusing on one body part, it\'s about getting everything moving and working together to burn calories while building up strength endurance.',
      picture:
        'https://www.bodybuilding.com/exercises/exerciseImages/sequences/147/Male/100sq/147_2.jpg',
      intensity: 'High'
    }
  ];
  try {
    console.log('Connecting to database...');
    await connect;
    console.log('Clearing data from all collections...');
    await removeAllCollections(); // isProduction ? ['users'] : []
    console.log('Seeding units collection...');
    const units = await Unit.create(unitsData);
    // let users;
    const usersData = [
      {
        firstname: 'Test',
        lastname: 'User 1',
        email: 'test@user1.com',
        password: 'testUser1!',
        experience: 'Beginner',
        reminderType: 'email',
        goal: 'Muscle Gain',
        height: 1.69,
        weight: 80,
        weightUnit: units[0].id,
        heightUnit: units[3].id,
      },
      {
        firstname: 'Test',
        lastname: 'User 2',
        email: 'test@user2.com',
        password: 'testUser2!',
        experience: 'Intermediate',
        goal: 'Athletic',
        reminderType: 'email',
        height: 66.535433071,
        weight: 176.368,
        weightUnit: units[1].id,
        heightUnit: units[2].id,
      },
      {
        firstname: 'Test',
        lastname: 'User 3',
        email: 'test@user3.com',
        password: 'testUser3!',
        experience: 'Expert',
        goal: 'Muscle Gain',
        height: 1.69,
        weight: 80,
        weightUnit: units[0].id,
        heightUnit: units[3].id,
      }
    ];
    // if (!isProduction) {
    console.log('Seeding users collection...');
    const users = await User.create(usersData);
    // } else {
    //   users = await User.find();
    // }
    console.log('Seeding exercises collection...');
    const exercises = await Exercise.insertMany(
      exercisesData.map((exercise) => {
        const exerciseCopy = { ...exercise };
        [
          ['picture_one', 'pictureOne'],
          ['picture_two', 'pictureTwo'],
          ['exercise_ratings', 'rating'],
          ['exercise_name', 'name']
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
    console.log('Seeding workoutexercises collection...');
    const exerciseIntermediate = await Exercise.find({ difficulty: 'Intermediate' });
    const exerciseExpert = await Exercise.find({ difficulty: 'Expert' });
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
        exerciseId: exercises[6].id,
        time: exerciseTimeByWorkoutIntensity(workouts[1].intensity)
      },
      {
        workoutId: workouts[1].id,
        exerciseId: exercises[8].id,
        time: exerciseTimeByWorkoutIntensity(workouts[1].intensity)
      },
      {
        workoutId: workouts[1].id,
        exerciseId: exercises[9].id,
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
      },
      {
        workoutId: workouts[5].id,
        exerciseId: exerciseIntermediate[0].id,
        time: exerciseTimeByWorkoutIntensity(workouts[5].intensity)
      },
      {
        workoutId: workouts[5].id,
        exerciseId: exerciseIntermediate[1].id,
        time: exerciseTimeByWorkoutIntensity(workouts[5].intensity)
      },
      {
        workoutId: workouts[5].id,
        exerciseId: exerciseIntermediate[2].id,
        time: exerciseTimeByWorkoutIntensity(workouts[5].intensity)
      },
      {
        workoutId: workouts[6].id,
        exerciseId: exerciseIntermediate[1].id,
        time: exerciseTimeByWorkoutIntensity(workouts[6].intensity)
      },
      {
        workoutId: workouts[6].id,
        exerciseId: exerciseIntermediate[3].id,
        time: exerciseTimeByWorkoutIntensity(workouts[6].intensity)
      },
      {
        workoutId: workouts[6].id,
        exerciseId: exerciseIntermediate[4].id,
        time: exerciseTimeByWorkoutIntensity(workouts[6].intensity)
      },
      {
        workoutId: workouts[7].id,
        exerciseId: exerciseExpert[0].id,
        time: exerciseTimeByWorkoutIntensity(workouts[7].intensity)
      },
      {
        workoutId: workouts[7].id,
        exerciseId: exerciseExpert[1].id,
        time: exerciseTimeByWorkoutIntensity(workouts[7].intensity)
      },
      {
        workoutId: workouts[7].id,
        exerciseId: exerciseExpert[2].id,
        time: exerciseTimeByWorkoutIntensity(workouts[7].intensity)
      },
      {
        workoutId: workouts[8].id,
        exerciseId: exerciseExpert[2].id,
        time: exerciseTimeByWorkoutIntensity(workouts[8].intensity)
      },
      {
        workoutId: workouts[8].id,
        exerciseId: exerciseExpert[4].id,
        time: exerciseTimeByWorkoutIntensity(workouts[8].intensity)
      },
      {
        workoutId: workouts[8].id,
        exerciseId: exerciseExpert[3].id,
        time: exerciseTimeByWorkoutIntensity(workouts[8].intensity)
      }
    ];
    await WorkoutExercise.insertMany(workoutExercisesData);
    const workoutSessionsData = [
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: newDate(-6),
        endDate: newDate(-6) + 1,
        pause: false,
        weight: 80
      },
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: newDate(-5),
        endDate: newDate(-5) + 1,
        pause: false,
        weight: 79.5
      },
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: newDate(-4),
        endDate: newDate(-4) + 1,
        pause: false,
        weight: 79
      },
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: newDate(-3),
        endDate: newDate(-3) + 1,
        pause: false,
        weight: 78.5
      },
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: newDate(-2),
        endDate: newDate(-2) + 1,
        pause: false,
        weight: 78
      },
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: newDate(-1),
        endDate: newDate(-1) + 1,
        pause: false,
        weight: 77.5
      },
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: newDate(),
        endDate: newDate() + 1,
        pause: false,
        weight: 77
      },
      {
        userId: users[0].id,
        workoutId: workouts[1].id,
        exerciseId: exercises[3].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[1].intensity),
        startDate: newDate(),
        endDate: newDate() + 1,
        pause: false,
        weight: 76.5
      },
      {
        userId: users[0].id,
        workoutId: workouts[2].id,
        exerciseId: exercises[6].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[2].intensity),
        startDate: Date.now(),
        endDate: null,
        pause: false,
        weight: 76
      },
      {
        userId: users[0].id,
        workoutId: workouts[3].id,
        exerciseId: exercises[1].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[3].intensity),
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[1].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[1].id,
        workoutId: workouts[1].id,
        exerciseId: exercises[3].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[1].intensity),
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[1].id,
        workoutId: workouts[2].id,
        exerciseId: exercises[6].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[2].intensity),
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[2].id,
        workoutId: workouts[0].id,
        exerciseId: exercises[0].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[0].intensity),
        startDate: Date.now(),
        endDate: null,
        pause: false
      },
      {
        userId: users[2].id,
        workoutId: workouts[1].id,
        exerciseId: exercises[3].id,
        exerciseTimer: exerciseTimeByWorkoutIntensity(workouts[1].intensity),
        startDate: Date.now(),
        endDate: null,
        pause: false
      }
    ];
    const sessions = await WorkoutSession.insertMany(workoutSessionsData);

    console.log('Seeding schedules collection...');
    const schedule = [
      {
        userId: users[0].id,
        workoutId: workouts[0].id,
        startDate: newDate(-6),
        routine: 'daily'
      },
      {
        userId: users[0].id,
        workoutId: workouts[1].id,
        startDate: newDate(),
        routine: 'weekly'
      },
      {
        userId: users[0].id,
        workoutId: workouts[2].id,
        startDate: newDate(1),
        routine: 'no'
      },
      {
        userId: users[0].id,
        workoutId: workouts[3].id,
        startDate: newDate(4),
        routine: 'no'
      },
    ];
    await Schedule.create(schedule);

    console.log('Seeding workoutsessionexercises collection...');
    await WorkoutSessionExercise.insertMany([
      {
        sessionId: sessions[0].id,
        exerciseId: exercises[0].id,
        reps: 5,
        sets: 3,
        amountLifted: 30
      },
      {
        sessionId: sessions[0].id,
        exerciseId: exercises[1].id,
        reps: 2,
        sets: 4,
        amountLifted: 20
      },
      {
        sessionId: sessions[0].id,
        exerciseId: exercises[2].id,
        reps: 1,
        sets: 2,
        amountLifted: 10
      }
    ]);
  } catch (err) {
    console.error(`SEEDERROR: ${err.message}`);
    if (err.message.includes('ns not found')) return false;
    if (err.message.includes('a background operation is currently running')) return false;
    throw new Error(err.message);
  }
  console.log('Successfully seeded the database!');
  return onEnd ? onEnd() : true;
};
