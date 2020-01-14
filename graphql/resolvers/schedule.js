const { PubSub } = require('apollo-server-express');
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
      let newNotification = new Notification({ userId, message, topic });
      newNotification = await newNotification.save();
      if (topic.includes('Workout')) {
        console.log(SCHEDULED_WORKOUTS);
        pubsub.publish(SCHEDULED_WORKOUTS, {
          scheduledWorkoutAlert: { ...newNotification._doc, id: newNotification.id }
        });
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
