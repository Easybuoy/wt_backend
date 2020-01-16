const ScheduleResolver = require('../../graphql/resolvers/schedule').Query;
const WorkoutSession = require('../../models/workoutSession');
const WorkoutSessionExercise = require('../../models/workoutSessionExercise');
const User = require('../../models/user');

const poundsToKg = (pounds) => pounds / 2.2046;

module.exports = {
  Query: {
    dashboard: async (_, args, context) => {
      const userId = context.user.id;
      const userWorkoutSessions = await WorkoutSession.find({ userId }).sort({ startDate: 'asc' });
      const userSchedule = await ScheduleResolver.userSchedule(null, null, context);
      const [userRes] = await User.find({ _id: userId });
      const user = userRes.populate('weightUnit').populate('heightUnit');
      const completedWorkoutSessionsWithWeight = userWorkoutSessions.filter(
        (session) => session.endDate !== null && session.weight !== null
      );
      const graphs = ['Weight', 'BMI'].map((graph) => {
        switch (graph) {
          case 'weight':
            return {
              name: graph,
              data: completedWorkoutSessionsWithWeight.map((session) => ({
                date: session.endDate,
                value: session.weight,
              }))
            };
          case 'bmi':
            return {
              name: graph,
              data: completedWorkoutSessionsWithWeight.map((session) => {
                const weight = user.weightUnit.name === 'pounds' ? poundsToKg(session.weight) : session.weight;
                const height = user.heightUnit.name === 'inches' ? user.height * 0.0254 : user.height;
                return {
                  date: session.endDate,
                  value: (weight / height).toFixed(2)
                };
              })
            };
          default: return false;
        }
      });
      const completedWorkoutSessionsStats = userWorkoutSessions.filter(
        (session) => session.endDate !== null
      );
      const userWorkoutSessionsExercises = await WorkoutSessionExercise.find({
        sessionId: { $in: completedWorkoutSessionsStats.map((session) => session.id) }
      });
      const stats = userWorkoutSessionsExercises.reduce((total, exerciseSession) => ({
        reps: total.reps + exerciseSession.reps,
        sets: total.sets + exerciseSession.sets,
        amountLifted: total.amountLifted + exerciseSession.amountLifted
      }), { reps: 0, sets: 0, amountLifted: 0 });


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
        streak,
        user: userRes,
      };
    }
  }
};
