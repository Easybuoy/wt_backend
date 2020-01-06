const { initTest, createUser } = require('../tests');
const { removeAllCollections } = require('../helpers');
const User = require('../../models/user');

initTest();

describe('Clear data from database', () => {
  it('Remove data from all collections', async (done) => {
    await createUser();
    let allUsers = await User.find();
    expect(allUsers.length).toBe(1);
    await removeAllCollections();
    allUsers = await User.find();
    expect(allUsers.length).toBe(0);
    done();
  });
});
