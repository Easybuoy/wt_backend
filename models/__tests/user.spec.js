const {
  initTest,
  query,
  // eslint-disable-next-line no-unused-vars
  createUser,
  testUser
} = require('../../helpers/tests');
const User = require('../../models/user');

initTest();

describe('User model', () => {
  it('Should save user to database', async (done) => {
    const newUser = new User(testUser);
    await newUser.save();
    const user = await User.findById(newUser.id);
    expect(user).toBeDefined();
    expect(user.firstname).toBe(testUser.firstname);
    done();
  });
  it('Should save google user to database', async (done) => {
    const addGoogleUser = await query(`
      mutation {
        authGoogle(input: {
          accessToken: "true"
        }) {
          id
          token
        }
      }
    `);
    const { data } = JSON.parse(addGoogleUser.res.text);
    const user = await User.findById(data.authGoogle.id);
    expect(user.id).toBeDefined();
    expect(user.google.id).toBeDefined();
    expect(user.google.token).toBeDefined();
    done();
  });
  it('Should save facebook user to database', async (done) => {
    const addFacebookUser = await query(`
      mutation {
        authFacebook(input: {
          accessToken: "true"
        }) {
          id
          token
        }
      }
    `);
    const { data } = JSON.parse(addFacebookUser.res.text);
    const user = await User.findById(data.authFacebook.id);
    expect(user.id).toBeDefined();
    expect(user.facebook.id).toBeDefined();
    expect(user.facebook.token).toBeDefined();
    done();
  });
  it('Should NOT save google user with invalid token', async (done) => {
    const addGoogleUser = await query(`
      mutation {
        authGoogle(input: {
          accessToken: "false"
        }) {
          id
          token
        }
      }
    `);
    const { data } = JSON.parse(addGoogleUser.res.text);
    expect(data.authGoogle.id).toBeNull();
    expect(data.authGoogle.token).toBeNull();
    done();
  });
  it('Should NOT save facebook user with invalid token', async (done) => {
    const addFacebookUser = await query(`
      mutation {
        authFacebook(input: {
          accessToken: "false"
        }) {
          id
          token
        }
      }
    `);
    const { data } = JSON.parse(addFacebookUser.res.text);
    expect(data.authFacebook.id).toBeNull();
    expect(data.authFacebook.token).toBeNull();
    done();
  });
});
