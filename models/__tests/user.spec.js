const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../../api/server');
const connect = require('../../api/database');
const User = require('../../models/user');

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  await collections.map((colname) => mongoose.connection.collections[colname])
    .forEach((col) => col.deleteMany());
}

beforeAll(async () => {
  await connect;
});

afterEach(async () => {
  await removeAllCollections();
});

describe('', () => {
  it('Should save user to database', async (done) => {
    await request(server).post('/api')
      .send({
        query: `
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
        `
      });
    const user = await User.findOne({ email: 'melqui@test.com' });
    expect(user.firstname).toBe('Melquisedeque');
    done();
  });
});
