const { initTest } = require('../../../helpers/tests');
const Exercise = require('../../../graphql/resolvers/exercise');

initTest();

describe('exercise', () => {
  it('it should fetch all exercises', async (done) => {
    // eslint-disable-next-line no-undef
    const exercises = Exercise.Query.exercises(null, {
      search: '',
      fields: ''
    });
    expect(exercises).toBeDefined();
    done();
  });
  jest.setTimeout(30000);
});
