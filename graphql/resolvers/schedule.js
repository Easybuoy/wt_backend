const { PubSub } = require('apollo-server-express');
const sendmail = require('sendmail')({
  logger: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  },
});
const Mailgen = require('mailgen');
const Schedule = require('../../models/schedule');
const User = require('../../models/user');
const Workout = require('../../models/workout');
const Notification = require('../../models/notification');
const WorkoutResolver = require('../../graphql/resolvers/workout').Workout;

const pubsub = new PubSub();
const SCHEDULED_WORKOUTS = 'scheduledWorkoutAlerts';

const startOfWeek = (startDate) => {
  const today = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  const difference = today.getDate() - today.getDay() + (today.getDay() === 0 ? -7 : 0);
  return today.setDate(difference);
};

const sendNotification = (notification) => {
  if (notification.topic.includes('Workout')) {
    pubsub.publish(SCHEDULED_WORKOUTS, {
      scheduledWorkoutAlert: { ...notification._doc, id: notification.id }
    });
  }
};

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // Appears in header & footer of e-mails
    name: 'Trackdrills',
    link: 'http://trackdrills.com/',
    logo: 'http://trackdrills.com/assets/images/logo.png'
  }
});

const sendEmail = (notification, user) => {
  sendmail({
    from: 'melquip7@gmail.com',
    to: 'durolawk@gmail.com',
    subject: notification.topic,
    html: mailGenerator.generate({
      body: {
        name: user.firstname,
        intro: notification.topic,
        action: {
          instructions: notification.message,
          button: {
            color: '#22BC66',
            text: 'Scheduled workouts',
            link: `http://trackdrills.com/workout/${notification.topic.split('_')[1]}`
          }
        },
        outro: 'Good luck!'
      }
    }),
  }, (err, reply) => {
    console.log(err && err.stack);
    console.dir(reply);
  });
};

module.exports = {
  Query: {
    userSchedule: async (_, args, context) => {
      const userId = context.user.id;
      let calendarStart = new Date().setHours(0, 0, 0, 0);
      calendarStart = new Date(calendarStart).setMonth(new Date(calendarStart).getMonth() - 3);
      let calendarEnd = new Date().setHours(0, 0, 0, 0);
      calendarEnd = new Date(calendarEnd).setMonth(new Date(calendarEnd).getMonth() + 3);
      const weekStart = startOfWeek();
      const userSchedule = await Schedule.find({
        userId,
        $or: [
          { startDate: { $gt: calendarStart, $lt: calendarEnd } },
          { routine: 'daily' },
          { routine: 'weekly' }
        ]
      }).sort({ startDate: 'asc' });
      const response = [];
      for (let day = calendarStart; day < calendarEnd; day += (1000 * 60 * 60 * 24)) {
        console.log(day);
        const dayOfWeek = new Date(day).getDay();
        const nextDay = day + (1000 * 60 * 60 * 24);
        userSchedule.forEach((schedule) => {
          if (
            (schedule.routine === 'daily'
              || (schedule.routine === 'weekly' && new Date(schedule.startDate).getDay() === dayOfWeek))
            && schedule.startDate >= day
          ) {
            response.push({
              ...schedule._doc,
              id: schedule.id,
              startDate: new Date(schedule.startDate).setDate(new Date(day).getDate())
            });
          }
          if (schedule.routine === 'monthly') {
            if (new Date(schedule.startDate).getDate() === new Date(day).getDate()) {
              response.push({
                ...schedule._doc,
                id: schedule.id,
                startDate: new Date(schedule.startDate).setMonth(new Date(day).getMonth())
              });
            }
          }
          if (schedule.startDate >= day && schedule.startDate < nextDay) {
            response.push(schedule);
          }
        });
      }
      return response;
    },
    suggestionsByExperience: async (_, args, context) => {
      const userId = context.user.id;
      const user = await User.findById(userId);
      const workouts = await Workout.find();
      const workoutsExperience = await Promise.all(workouts.map(
        (workout) => WorkoutResolver.experience(workout, null, context)
      ));
      return workouts.map((workout, index) => ({
        ...workout._doc,
        id: workout.id,
        experience: workoutsExperience[index]
      })).filter((workout) => workout.experience === user.experience);
    }
  },
  Mutation: {
    pushNotification: async (_, { input: { userId, message, topic } }) => {
      const user = await User.findById(userId);
      let newNotification = new Notification({
        userId,
        message,
        topic,
        type: user.reminderType
      });
      newNotification = await newNotification.save();
      if (user.reminderType === 'notification') {
        sendNotification(newNotification);
      } else {
        sendEmail(newNotification, user);
      }
      return newNotification;
    },
    scheduleWorkout: async (_, {
      input: {
        workoutId, startDate, reminderTime, routine
      }
    }, context) => {
      const userId = context.user.id;
      let schedule = new Schedule({
        workoutId, startDate, reminderTime, routine, userId
      });
      schedule = await schedule.save();
      if (routine === 'daily') {
        // start on startDate and repeats every 24 hours
        // stops
      }
      return schedule;
    }
  },
  Subscription: {
    scheduledWorkoutAlert: {
      subscribe: () => {
        console.log(SCHEDULED_WORKOUTS);
        return pubsub.asyncIterator(SCHEDULED_WORKOUTS);
      }
    }
  }
};
