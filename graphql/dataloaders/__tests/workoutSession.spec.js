const { initTest, query } = require('../../../helpers/tests');
const User = require('../../../models/user');
const WorkoutSessionDL = require('../workoutSession');
const seed = require('../../../helpers/seed');

initTest();

describe('WorkoutSession data loader', () => {
  it('Should only make one database request when getting workouts', async (done) => {
    const DLSpy = jest.spyOn(WorkoutSessionDL, 'workoutSessionDataLoader');
    await seed();
    const randomUser = await User.findOne({ email: 'test@user1.com' });
    expect(randomUser.id).toBeDefined();
    await query(`
      query { 
        workouts(
          input: {
            search: ""
            fields: ["name"]
          }
        ) { 
          id
          userId
          name
          description
          intensity
          picture
          avgTime
          equipment
          muscles
          types
          session {
            id
            userId
          }
          experience
        }
      }
    `, randomUser.generateJWT());
    expect(DLSpy).toHaveBeenCalledTimes(1);
    done();
  });
});
