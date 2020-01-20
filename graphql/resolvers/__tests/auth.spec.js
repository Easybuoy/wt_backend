const { initTest, createUser, testUser } = require('../../../helpers/tests');
const authResolver = require('../auth');

initTest();

describe('authentication', () => {
  it('it should add user if they don\'t exist', async (done) => {
    const user = await authResolver.Mutation.addUser(null, { input: testUser });
    expect(user).toBeDefined();
    done();
  });
  it('it should update user', async (done) => {
    const user = await createUser();
    const updatedUser = await authResolver.Mutation.updateUser(null, { input: { id: user.id, firstname: 'Sandrava' } });
    expect(updatedUser.id).toBeDefined();
    done();
  });
  it('it should not throw error all details are correct', async (done) => {
    await createUser();
    expect(() => {
      authResolver.Query.authForm(null, { input: { email: 'melqui@test.com', password: 'tester12T$', remember: true } });
    }).not.toThrow();
    done();
  });
  it('it should add Facebook user', async (done) => {
    const user = await authResolver.Mutation.authFacebook(
      null,
      { input: { accessToken: true } },
      { req: { body: null }, res: null }
    );
    expect(user).toBeDefined();
    done();
  });
  it('it should add Google user', async (done) => {
    const user = await authResolver.Mutation.authGoogle(
      null,
      { input: { accessToken: true } },
      { req: { body: null }, res: null }
    );
    expect(user).toBeDefined();
    done();
  });
});
