const { initTest, query } = require('../../helpers/tests');
const User = require('../../models/user');

initTest();

const createUser = () => query(`
  mutation {
    addUser(input: { 
      firstname:"Melquisedeque", 
      lastname:"Pereira"
      email: "melqui@test.com", 
      password:"tester12T$" 
      rePassword:"tester12T$"
    }) {
      id
      firstname
      lastname
      token
    }
  }
`);

describe('User model', () => {
  it('Should save user to database', async (done) => {
    await createUser();
    const user = await User.findOne({ email: 'melqui@test.com' });
    expect(user.firstname).toBe('Melquisedeque');
    done();
  });
  it('Should save google user to database', async (done) => {
    const addGoogleUser = await query(`
      mutation {
        authGoogle(input: {
          accessToken: ""
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
          accessToken: ""
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
});
