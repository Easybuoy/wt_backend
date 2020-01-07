const DataLoader = require('dataloader');
const WorkoutExercise = require('../../models/workoutExercise');


function workoutExercisesDL(workoutIds) {
  return WorkoutExercise.find({ workoutId: { $in: workoutIds } })
    .then((workoutExercises) => workoutIds.map(
      (workoutExerciseId) => workoutExercises.filter(
        (workoutExercise) => workoutExercise.id === workoutExerciseId.toString()
      )[0]
    ));
}
function createWorkoutExercisesDL(context) {
  const ctx = context;
  if (!ctx.workoutExercisesDL) {
    // eslint-disable-next-line no-use-before-define
    ctx.workoutExercisesDL = new DataLoader(exportFunctions.workoutExercisesDL);
  }
  return ctx.workoutExercisesDL;
}

// the use of this object facilitates dataloader testing / spy & mock functions
const exportFunctions = {
  workoutExercisesDL,
  createWorkoutExercisesDL
};

module.exports = exportFunctions;
