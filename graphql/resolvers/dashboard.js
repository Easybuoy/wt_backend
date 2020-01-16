const ScheduleResolver = require('../../graphql/resolvers/schedule').Query;
const WorkoutSession = require('../../models/workoutSession');
const User = require('../../models/user');

const poundsToKg = (pounds) => pounds / 2.2046;

module.exports = {
  Query: {
    dashboard: async (_, args, context) => {
      const userId = context.user.id;
      const stats = [];
      const userWorkoutSessions = await WorkoutSession.find({ userId }).sort({ startDate: 'asc' });
      const userSchedule = await ScheduleResolver.userSchedule(null, null, context);
      const [user] = await User.find({ _id: userId }).populate('weightUnit').populate('heightUnit');
      const completedWorkoutSessions = userWorkoutSessions.filter(
        (session) => session.endDate !== null && session.weight !== null
      );
      const graphs = ['weight', 'bmi'].map((graph) => {
        switch (graph) {
          case 'weight':
            return {
              name: graph,
              data: completedWorkoutSessions.map((session) => ({
                date: session.endDate,
                value: session.weight,
              }))
            };
          case 'bmi':
            return {
              name: graph,
              data: completedWorkoutSessions.map((session) => {
                const weight = user.weightUnit.name === 'pounds' ? poundsToKg(session.weight) : session.weight;
                const height = user.heightUnit.name === 'inches' ? user.height * 0.0254 : user.height;
                return {
                  date: session.endDate,
                  value: weight / height
                };
              })
            };
          default: return false;
        }
      });


      // go over all the scheduled workouts
      // filter out future scheduled workout routines
      // try to find a matching workout session that is completed
      // make sure that the startDate is close enough to scheduled date
      let streak = 0;
      const rightNow = Date.now();
      userSchedule.forEach((schedule) => {
        if (schedule.startDate <= rightNow) {
          const scheduleDate = new Date(schedule.startDate);
          const pastHour = new Date(scheduleDate).setHours(scheduleDate.getHours() - 1);
          const futureHour = new Date(scheduleDate).setHours(scheduleDate.getHours() + 1);
          const nextDay = new Date(scheduleDate).setHours(scheduleDate.getHours() + 24);
          const workoutSession = userWorkoutSessions.find((session) => {
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
