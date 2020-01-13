const Schedule = require('../../models/schedule');

const startOfWeek = () => {
  const today = new Date();
  const difference = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
  return new Date(today.setDate(difference)).getTime();
};

module.exports = {
  Query: {
    userSchedule: async (_, args, context) => {
      const userId = context.user.id;
      const today = new Date();
      const weekStart = startOfWeek();
      const userSchedule = Schedule.find({
        userId,
        startDate: { $gt: weekStart }
      });
      return new Array(7).map((day, index) => {
        const currentDay = new Date(
          today.setDate(weekStart.getDate() + index)
        ).getTime();
        const nextDay = new Date(
          today.setDate(weekStart.getDate() + index + 1)
        ).getTime();
        return userSchedule.filter((schedule) => (
          schedule.startDate >= currentDay && schedule.startDate < nextDay
        ));
      });
    }
  },
  Mutation: {}
};
