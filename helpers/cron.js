const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const Schedule = require('../models/schedule');
const User = require('../models/user');

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


cron.schedule('*/5 * * * * *', async () => {
  console.log('5 secs');
  fs.writeFileSync(`${__dirname}/logs.txt`, '5secs');
  const schedules = await Schedule.find()
  schedules.forEach((schedule) => {
    const date = new Date(schedule.startDate);
    date.setMinutes(-schedule.reminderTime);
    fs.writeFileSync('./logs.txt', `${date.getSeconds()}
      ${date.getMinutes()}
      ${date.getHours()}
      ${date.getDate()}
      ${date.getMonth()} *`);
    cron.schedule(`${date.getSeconds()}
    ${date.getMinutes()}
    ${date.getHours()}
    ${date.getDate()}
    ${date.getMonth()} *`, () => {
      console.log(schedule);
      axios.post('http://localhost:4000/api', { query: createQuery(schedule) });
    });
  });
});
