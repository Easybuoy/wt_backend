const ScheduleResolver = require('../../graphql/resolvers/schedule').Query;
const WorkoutSession = require('../../models/workoutSession');

module.exports = {
  Query: {
    dashboard: async (_, args, context) => {
      const userId = context.user.id;

      const graphs = [];
      const stats = [];
      let streak = 0;
      const userWorkouts = await WorkoutSession.find({ userId }).sort({ startDate: 'asc' });
      const userSchedule = await ScheduleResolver.userSchedule(null, null, context);

      // go over all the scheduled workouts
      // filter out future scheduled workout routines
      // try to find a matching workout session that is completed
      // make sure that the startDate is close enough to scheduled date
      const rightNow = Date.now();
      userSchedule.forEach((schedule) => {
        if (schedule.startDate <= rightNow) {
          const scheduleDate = new Date(schedule.startDate);
          const pastHour = new Date(scheduleDate).setHours(scheduleDate.getHours() - 1);
          const futureHour = new Date(scheduleDate).setHours(scheduleDate.getHours() + 1);
          const nextDay = new Date(scheduleDate).setHours(scheduleDate.getHours() + 24);
          const workoutSession = userWorkouts.find((session) => {
            if (
              // match workout with scheduled workout
              session.workoutId.toString() === schedule.workoutId.toString()
              // the date is within reasonable timeframe related to scheduled date
              && session.startDate >= pastHour && session.startDate <= futureHour
              // the endDate is NOT null so the session was completed
              && session.endDate !== null
              // it was completed within 1 day
              && session.endDate < nextDay
            ) {
              return true;
            }
            return false;
          });
          // if there is a workout session that matches this scheduled workout
          if (typeof workoutSession !== 'undefined') {
            streak += 1;
          } else {
            streak = 0;
          }
        }
      });

      return {
        graphs,
        stats,
        streak
      };
    }
  }
};
