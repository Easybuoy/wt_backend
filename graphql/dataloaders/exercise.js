const DataLoader = require('dataloader');
const Exercise = require('../../models/exercise');
const WorkoutExercise = require('../../models/workoutExercise');

const getExercises = async (exerciseIds) => {
  const exercises = await Exercise.find({ _id: { $in: exerciseIds } });
  return exercises.reduce((list, exercise) => {
    const exercisesList = list;
    exercisesList[exercise.id.toString()] = { ...exercise._doc, id: exercise.id };
    return exercisesList;
  }, {});
};

async function exerciseDataLoader(workoutIds) {
  const workoutsExercises = await WorkoutExercise.find({ workoutId: { $in: workoutIds } });
  const exerciseIds = workoutsExercises.map((workoutEx) => workoutEx.exerciseId.toString());
  const exercises = await getExercises(exerciseIds);
  return workoutsExercises.reduce((response, workoutEx) => {
    const workoutIndex = workoutIds.indexOf(workoutEx.workoutId.toString());
    if (typeof response[workoutIndex] === 'undefined') response.push([]);
    const exercise = exercises[workoutEx.exerciseId.toString()];
    response[workoutIndex].push({ ...exercise, time: workoutEx.time });
    return response;
  }, []);
}

function createExerciseDL(context) {
  const ctx = context;
  if (!ctx.exerciseDataLoader) {
    // eslint-disable-next-line no-use-before-define
    ctx.exerciseDataLoader = new DataLoader(exportFunctions.exerciseDataLoader);
  }
  return ctx.exerciseDataLoader;
}

// the use of this object facilitates dataloader testing / spy & mock functions
const exportFunctions = {
  exerciseDataLoader,
  createExerciseDL
};

module.exports = exportFunctions;
