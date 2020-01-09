const DataLoader = require('dataloader');
const WorkoutSession = require('../../models/workoutSession');

async function workoutSessionDataLoader(workoutSessionIds) {
  // [ { userId, workoutId, endDate: null }, { userId, workoutId, endDate: null }]
  // all workout sessions are object with userId, workoutId
  const userIds = workoutSessionIds.map((session) => session.userId);
  const workoutIds = workoutSessionIds.map((session) => session.workoutId);
  const possibleSessions = await WorkoutSession.find({
    userId: { $in: userIds },
    workoutId: { $in: workoutIds },
    endDate: null
  });
  return workoutSessionIds.map((workoutSession) => {
    return possibleSessions.find((session) => {
      if (session.userId.toString() === workoutSession.userId) {
        if (session.workoutId.toString() === workoutSession.workoutId) {
          return true
        }
      }
      return false
    })
  });
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
