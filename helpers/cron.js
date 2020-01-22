/* eslint-disable no-console */
const cron = require('node-cron');
const axios = require('axios');
const { isProduction, port, notificationsCronTimer } = require('../config');
const Cron = require('../models/cron');
const Schedule = require('../models/schedule');

const pushNotificationQuery = (schedule) => `mutation {
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

// TODO:
// if server restarts/closes, crons will no longer be scheduled
// because the crons collection will hold old records
// and right now there's no way of rescheduling
// either drop crons collection on server restart/close
// change the way crons are saved in order to be able to
// reschedule or cancel a notification

// Every minute, schedule reminders
// for all user scheduled workouts for the next week
// but only if they (the cron jobs) haven't been scheduled yet
cron.schedule(notificationsCronTimer, async () => {
  console.log('\n----------------1min----------------');
  console.log('---CRON-SCHEDULING-USER-REMINDERS---\n');
  const crons = await Cron.find();
  const futureWeek = new Date().setDate(new Date().getDate() + 7);
  const todayMidnight = new Date().setHours(0, 0, 0, 0);
  // scheduled workouts, between now and a week in the future
  const scheduledWorkouts = await Schedule.find({
    startDate: { $gt: todayMidnight, $lt: futureWeek },
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
  });
  // generate cron jobs
  const newCrons = allScheduled.map((sw) => {
    // find if there's already been scheduled a cron job with this scheduleID and of the same date
    // we need to compare date/routine because of routine schedules (otherwise id would suffice)
    const scheduledCron = crons.find(
      (c) => c.scheduleId.toString() === sw.id.toString()
        && c.startDate === sw.startDate
        && c.routine === sw.routine
    );
    if (scheduledCron) return false;
    // manage scheduled date
    let date = new Date(sw.startDate);
    date.setMinutes(-sw.reminderTime);
    date = {
      sec: date.getSeconds(),
      min: date.getMinutes(),
      hour: date.getHours(),
      day: date.getDate(),
      month: date.getMonth() + 1,
    };
    // schedule reminders for this week
    cron.schedule(`${date.sec} ${date.min} ${date.hour} ${date.day} ${date.month} *`, async () => {
      const scheduleStillExists = await Schedule.findById(sw.id);
      if (scheduleStillExists) {
        await axios.post(
          (
            isProduction
              ? 'https://trackdrills-staging.herokuapp.com/api'
              : `http://localhost:${port}/api`
          ),
          {
            query: pushNotificationQuery(sw)
          }
        );
      }
    });
    // remember this newly added cron job
    return (new Cron({
      scheduleId: sw.id,
      userId: sw.userId,
      workoutId: sw.workoutId,
      startDate: sw.startDate,
      reminderTime: sw.reminderTime,
      routine: sw.routine,
    }));
  }).filter((c) => c !== false);
  // save the scheduled crons
  await Cron.insertMany(newCrons);
  // delete old records
  await Cron.deleteMany({ startDate: { $lt: todayMidnight } });
  console.log('\n----------------END-----------------\n');
});
