const DataLoader = require('dataloader');
const Exercise = require('../../models/exercise');
const WorkoutExercise = require('../../models/workoutExercise');

const getExercise = async (row) => {
  const exercise = await Exercise.findById(row.exerciseId.toString());
  return { ...exercise._doc, id: exercise.id, time: row.time };
};

async function exerciseDataLoader(workoutIds) {
  const workoutsExercises = await WorkoutExercise.find({ workoutId: { $in: workoutIds } });
  return workoutsExercises.reduce(async (response, row) => {
    const res = await response;
    const workoutIndex = workoutIds.indexOf(row.workoutId.toString());
    if (typeof res[workoutIndex] === 'undefined') res.push([]);
    res[workoutIndex].push(await getExercise(row));
    return res;
  }, Promise.resolve([]));
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
