const { initTest, createUser, query } = require('../../../helpers/tests');
const Exercise = require('../../../models/exercise');
const Workout = require('../../../models/workout');
const ExerciseDL = require('../exercise');

initTest();

describe('Exercise data loader', () => {
  it('Should only make one database request when getting user units', async (done) => {
    const DLSpy = jest.spyOn(ExerciseDL, 'exerciseDataLoader');
    // create a new user
    const testUser = await createUser();
    expect(testUser.id).toBeDefined();
    expect(testUser.token).toBeDefined();
    // create new units
    let exercise1 = new Exercise({ name: 'test', description: 'carry weights', difficulty: 'beginner' });
    let exercise2 = new Exercise({ name: 'test2', description: 'carry weights2', difficulty: 'beginner' });
    exercise1 = await exercise1.save();
    exercise2 = await exercise2.save();
    let workout = new Workout({ name: 'testWorkout', exercises: [exercise1, exercise2] });
    workout = await workout.save();
    expect(exercise1.id).toBeDefined();
    expect(exercise2.id).toBeDefined();
    const exercises = await Exercise.find();
    expect(exercises).toHaveLength(2);
    // update user with new units
    await query(`
      query { 
        workout( 
           id: "${workout._id}"
        ) { 
            id
            name
            exercises {
                id
                name
                difficulty
            }
        }
      }
    `, testUser.token);
    // dataloader must only run once even when fetching more than 1 unit
    expect(DLSpy).toHaveBeenCalledTimes(1);
    done();
  });
});
