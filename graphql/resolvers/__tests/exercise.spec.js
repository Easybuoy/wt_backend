const { initTest } = require('../../../helpers/tests');
const Exercise = require('../../../graphql/resolvers/exercise');

initTest();

describe('exercise', () => {
  it('it should fetch all exercises', async (done) => {
    // eslint-disable-next-line no-undef
    const exercises = Exercise.Query.exercises(null, { search: '', fields: '' });
    expect(exercises).toBeDefined();
    done();
  });
  jest.setTimeout(30000);

//   it('it should fetch a single exercise', async (done) => {
//     // eslint-disable-next-line no-undef
//     const id = '5e25e3385ee7785a404e68b0';
//     const exercise = await Exercise.Query.exercise(null, { id });
//     expect(exercise).toBeFalsy();
//     done();
//   });
//   jest.setTimeout(30000);
});
