/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const mongoose = require('mongoose');
const passport = require('passport');
const server = require('../api/server');
const connect = require('../api/database');
const { removeAllCollections } = require('./helpers');

const testPlatformToken = 'true';
const testUser = {
  firstname: 'Melquisedeque',
  lastname: 'Pereira',
  email: 'melqui@test.com',
  password: 'tester12T$'
};

passport.authenticate = jest.fn((authType, options, callback) => (req) => {
  const errorToken = req.body.access_token !== testPlatformToken;
  callback(errorToken ? true : null, {
    accessToken: testPlatformToken,
    profile: {
      id: 12345,
      displayName: testUser.firstname,
      familyName: testUser.lastname,
      emails: [{ value: testUser.email }]
    }
  }, null);
});

const query = (graphql, authToken = '') => request(server).post('/api').send({ query: graphql }).set('Authorization', authToken);

module.exports = {
  initTest: () => {
    // wait for the DB to connect
    beforeAll(async (done) => {
      jest.setTimeout(10000);
      await connect;
      done();
    });
    // clear all collections' data
    beforeEach(async (done) => {
      await removeAllCollections();
      done();
    });
    // Disconnect Mongoose
    afterAll(async (done) => {
      await removeAllCollections();
      await mongoose.connection.close();
      done();
    });
  },
  query,
  testUser,
  createUser: async (user = testUser) => {
    const newUser = await query(`
      mutation {
        addUser(input: {
          firstname:"${user.firstname}"
          lastname:"${user.lastname}"
          email:"${user.email}"
          password:"${user.password}" 
          rePassword:"${user.password}"
        }) {
          id
          firstname
          lastname
          token
        }
      }
    `);
    return JSON.parse(newUser.res.text).data.addUser;
  },
  getUnits: async () => {
    const allUnits = await query(`
      query {
        units {
          id
          name
          type
        }
      }
    `);
    return JSON.parse(allUnits.res.text).data.units;
  }
};
