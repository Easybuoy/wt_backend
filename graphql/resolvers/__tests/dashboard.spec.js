const { initTest, createUser } = require('../../../helpers/tests');
const dashboardResolver = require('../dashboard');
const User = require('../../../models/user');
const context = require('../../../graphql/context');
const seed = require('../../../helpers/seed');

initTest();

describe('dashboard resolver', () => {
  it('should get all dashboard information', async (done) => {
    // seed some basic data
    await seed();
    // get first user from seed data
    const testUser1 = await User.findOne({ email: 'test@user1.com' });
    // create user context variables
    const contextUser1 = await context({
      req: {
        headers: {
          authorization: testUser1.generateJWT()
        }
      }
    });
    // retrieve data from seed
    const dashboard = await dashboardResolver.Query.dashboard(
      null,
      null,
      contextUser1
    );
    expect(dashboard.graphs.length).toBeGreaterThan(0);
    expect(dashboard.graphs[0].name).toBe('Weight');
    expect(dashboard.stats.reps).toBeGreaterThan(1);
    expect(dashboard.stats.sets).toBeGreaterThan(1);
    expect(dashboard.stats.amountLifted).toBeGreaterThan(1);
    expect(dashboard.streak).toBeGreaterThan(1);
    done();
  });
});
