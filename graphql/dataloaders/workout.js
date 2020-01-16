const DataLoader = require('dataloader');
const Workout = require('../../models/workout');

function workoutDataLoader(workoutIds) {
  return Workout.find({ _id: { $in: workoutIds } }).then((workouts) => workoutIds.map(
    (workoutId) => workouts.find((workout) => workout.id === workoutId.toString())
  ));
}

function createWorkoutDL(context) {
  const ctx = context;
  if (!ctx.workoutDataLoader) {
    // eslint-disable-next-line no-use-before-define
    ctx.workoutDataLoader = new DataLoader(exportFunctions.workoutDataLoader);
  }
  return ctx.workoutDataLoader;
}

// the use of this object facilitates dataloader testing / spy & mock functions
const exportFunctions = {
  workoutDataLoader,
  createWorkoutDL
};

module.exports = exportFunctions;
