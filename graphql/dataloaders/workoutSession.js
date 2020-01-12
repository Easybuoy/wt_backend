const DataLoader = require('dataloader');
const WorkoutSession = require('../../models/workoutSession');

async function workoutSessionDataLoader(workoutSessionIds) {
  // all workout sessions are an object with userId and workoutId
  const userIds = workoutSessionIds.map((session) => session.userId);
  const workoutIds = workoutSessionIds.map((session) => session.workoutId);
  const allSessions = await WorkoutSession.find({
    userId: { $in: userIds },
    workoutId: { $in: workoutIds },
    endDate: null // very important filter
  });
  return workoutSessionIds.map((ws) => allSessions.find(
    (s) => s.userId.toString() === ws.userId && s.workoutId.toString() === ws.workoutId
  ));
}

function createWorkoutSessionDL(context) {
  const ctx = context;
  if (!ctx.workoutSessionDataLoader) {
    // eslint-disable-next-line no-use-before-define
    ctx.workoutSessionDataLoader = new DataLoader(exportFunctions.workoutSessionDataLoader);
  }
  return ctx.workoutSessionDataLoader;
}

// the use of this object facilitates dataloader testing / spy & mock functions
const exportFunctions = {
  workoutSessionDataLoader,
  createWorkoutSessionDL
};

module.exports = exportFunctions;
