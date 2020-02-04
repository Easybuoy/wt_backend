const { initTest } = require('../../../helpers/tests');
const Workout = require('../../../models/workout');
const User = require('../../../models/user');
const workoutResolver = require('../workout');
const seed = require('../../../helpers/seed');

initTest();

describe('workout resolver', () => {
  describe('find workouts endpoint', () => {
    it('should get a list of workouts', async (done) => {
      await seed();
      const workouts = await workoutResolver.Query.workouts(null, {
        input: {
          search: '', fields: ['name']
        }
      });
      expect(workouts.length).toBeGreaterThan(7);
      done();
    });
  });
  describe('find workout endpoint', () => {
    it('should get a specific workout', async (done) => {
      await seed();
      const randomWorkout = await Workout.findOne();
      const workout = await workoutResolver.Query.workout(null, {
        id: randomWorkout.id
      });
      expect(workout.id).toBe(randomWorkout.id);
      done();
    });
  });
  describe('find completed workouts endpoint', () => {
    it('should get a list of specific user\'s completed workouts', async (done) => {
      await seed();
      const randomUser = await User.findOne();
      const completedWorkouts = await workoutResolver.Query.completedWorkouts(null, null, {
        user: { id: randomUser.id }
      });
      expect(completedWorkouts.length).toBeGreaterThan(0);
      done();
    });
  });
  describe('find completed workouts gallery endpoint', () => {
    it('should get a list of progress pictures', async (done) => {
      await seed();
      const completedWorkoutsGallery = await workoutResolver.Query.completedWorkoutsGallery();
      expect(completedWorkoutsGallery.length).toBeGreaterThan(0);
      expect(completedWorkoutsGallery[0].gallery.length).toBeGreaterThan(0);
      done();
    });
  });
});
