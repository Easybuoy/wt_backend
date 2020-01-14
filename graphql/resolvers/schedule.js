const { PubSub } = require('apollo-server-express');
const sendmail = require('sendmail')({
  logger: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  },
});
const Schedule = require('../../models/schedule');
const User = require('../../models/user');
const Workout = require('../../models/workout');
const Notification = require('../../models/notification');
const WorkoutResolver = require('../../graphql/resolvers/workout').Workout;

const pubsub = new PubSub();
const SCHEDULED_WORKOUTS = 'scheduledWorkoutAlerts';

const startOfWeek = () => {
  const today = new Date();
  const difference = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
  return new Date(today.setDate(difference)).getTime();
};

const sendNotification = (notification) => {
  if (notification.topic.includes('Workout')) {
    pubsub.publish(SCHEDULED_WORKOUTS, {
      scheduledWorkoutAlert: { ...notification._doc, id: notification.id }
    });
  }
};

const sendEmail = (notification) => {
  sendmail({
    from: 'melquip7@gmail.com',
    to: 'melquip7@gmail.com',
    subject: notification.topic,
    html: notification.message,
  }, (err, reply) => {
    console.log(err && err.stack);
    console.dir(reply);
  });
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
      let newNotification = new Notification({ userId, message, topic });
      newNotification = await newNotification.save();
      if (user.reminderType === 'notification') {
        sendNotification(newNotification);
      } else {
        sendEmail(newNotification);
      }
      return newNotification;
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
