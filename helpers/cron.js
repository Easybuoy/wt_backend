const cron = require('node-cron');
const axios = require('axios');
const Schedule = require('../models/schedule');

const createQuery = (schedule) => `mutation {
  pushNotification (input: {
    userId: "${schedule.userId}",
    message: "You have a scheduled workout in ${schedule.reminderTime} minutes!",
    topic: "Workout_${schedule.workoutId}"
  }) {
    userId
    message
    topic
  }
}`;

// Every monday, schedule reminders for all user workouts for the next week
cron.schedule('*/5 * * * * *', async () => {
  const futureWeek = new Date().setDate(new Date().getDate() + 7);
  // scheduled workouts, between now and a week in the future
  const scheduledWorkouts = await Schedule.find({
    startDate: { $gt: Date.now(), $lt: futureWeek },
    routine: 'no'
  });
  const scheduledRoutines = await Schedule.find({
    routine: { $ne: 'no' },
  });
  const scheduled = [...scheduledWorkouts, ...scheduledRoutines];
  const allScheduled = [];
  // same logic than userSchedule resolver
  for (let day = new Date(); day < new Date(futureWeek); day.setDate(new Date(day).getDate() + 1)) {
    const dayTime = day.getTime();
    const dayOfWeek = new Date(dayTime).getDay();
    const nextDay = new Date(dayTime).setDate(new Date(dayTime).getDate() + 1);
    scheduled.forEach((schedule) => {
      const scheduleDate = new Date(schedule.startDate);
      const sDate = {
        h: scheduleDate.getHours(),
        m: scheduleDate.getMinutes(),
        s: scheduleDate.getSeconds(),
        ms: scheduleDate.getMilliseconds(),
      };
      if ((
        schedule.routine === 'daily'
        || (schedule.routine === 'weekly' && scheduleDate.getDay() === dayOfWeek))
        && schedule.startDate < dayTime
      ) {
        allScheduled.push({
          ...schedule._doc,
          id: schedule.id,
          startDate: new Date(day).setHours(sDate.h, sDate.m, sDate.s, sDate.ms)
        });
      } else if (schedule.startDate >= dayTime && schedule.startDate < nextDay) {
        allScheduled.push(schedule);
      }
    });
  }
  // sort all by date
  allScheduled.sort((s1, s2) => {
    if (s1.startDate > s2.startDate) return 1;
    if (s1.startDate < s2.startDate) return -1;
    return 0;
  }).forEach((schedule) => {
    let date = new Date(schedule.startDate);
    date.setMinutes(-schedule.reminderTime);
    date = {
      sec: date.getSeconds(),
      min: date.getMinutes(),
      hour: date.getHours(),
      day: date.getDate(),
      month: date.getMonth() + 1,
    };
    // schedule reminders for this week
    cron.schedule(`${date.sec} ${date.min} ${date.hour} ${date.day} ${date.month} *`, async () => {
      const scheduleStillExists = await Schedule.findById(schedule.id);
      if (scheduleStillExists) {
        await axios.post('http://localhost:4000/api', { query: createQuery(schedule) });
      }
    });
  });
});
