
const { initTest, query } = require('../../helpers/tests');
const User = require('../../models/user');

initTest();

describe('', () => {
  it('Should save user to database', async (done) => {
    await query(`
      mutation {
        addUser(input: { 
          firstname:"Melquisedeque", 
          lastname:"Pereira"
          email: "melqui@test.com", 
          password:"tester12T$" 
          rePassword:"tester12T$"
        }) {
          firstname
          lastname
          email
          password
        }
      }
    `);
    const user = await User.findOne({ email: 'melqui@test.com' });
    expect(user.firstname).toBe('Melquisedeque');
    done();
  });
});
