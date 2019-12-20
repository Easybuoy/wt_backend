const { initTest, query } = require('../../helpers/tests');
const User = require('../../models/user');

initTest();

const getGoogleToken = () => 'ya29.Il-2B_WdBM0Im6bKt3FFg9WJXmplf5A7krvwjufD3ZT86obfHtSBXSvJ88fgJr4_TpdTrAEWMacHXFrvDrU4pMmrCaDaO7ovydSPeROrBE75pa9Q-2LO4uqTJqfq_QpGng';
const getFacebookToken = () => 'ya29.Il-2B_WdBM0Im6bKt3FFg9WJXmplf5A7krvwjufD3ZT86obfHtSBXSvJ88fgJr4_TpdTrAEWMacHXFrvDrU4pMmrCaDaO7ovydSPeROrBE75pa9Q-2LO4uqTJqfq_QpGng';

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
          accessToken: ${getGoogleToken()}
        }) {
          id
          token
        }
      }
    `);
    const { authGoogle } = JSON.parse(addGoogleUser.res.text).data;
    const user = await User.findById(authGoogle.id);
    expect(user.id).toBeDefined();
    expect(user.google.id).toBeDefined();
    expect(user.google.token).toBeDefined();
    done();
  });
  it('Should save facebook user to database', async (done) => {
    const addFacebookUser = await query(`
      mutation {
        authFacebook(input: {
          accessToken: ${getFacebookToken()}
        }) {
          id
          token
        }
      }
    `);
    const { authFacebook } = JSON.parse(addFacebookUser.res.text).data;
    const user = await User.findById(authFacebook.id);
    expect(user.id).toBeDefined();
    expect(user.facebook.id).toBeDefined();
    expect(user.facebook.token).toBeDefined();
    done();
  });
});
