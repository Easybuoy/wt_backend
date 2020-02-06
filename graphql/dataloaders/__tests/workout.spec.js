const { initTest, query } = require('../../../helpers/tests');
const User = require('../../../models/user');
const WorkoutDL = require('../workout');
const seed = require('../../../helpers/seed');

initTest();

describe('Workout data loader', () => {
  it('Should only make one database request when getting user schedules', async (done) => {
    const DLSpy = jest.spyOn(WorkoutDL, 'workoutDataLoader');
    await seed();
    const randomUser = await User.findOne({ email: 'test@user1.com' });
    expect(randomUser.id).toBeDefined();
    await query(`
      query { 
        userSchedule { 
          id
          userId
          workoutId {
            id
            name
          }
          startDate
          routine
        }
      }
    `, randomUser.generateJWT());
    expect(DLSpy).toHaveBeenCalledTimes(1);
    done();
  });
});
