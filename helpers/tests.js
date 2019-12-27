/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const mongoose = require('mongoose');
const passport = require('passport');
const server = require('../api/server');
const connect = require('../api/database');
const { removeAllCollections } = require('./helpers');

const testUser = {
  firstname: 'Melquisedeque',
  lastname: 'Pereira',
  email: 'melqui@test.com',
  password: 'tester12T$'
};

passport.authenticate = jest.fn((authType, options, callback) => () => {
  callback(null, {
    accessToken: true,
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
      await connect;
      await removeAllCollections();
      done();
    });

    // clear all collection rows
    afterEach(async (done) => {
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
  createUser: () => query(`
    mutation {
      addUser(input: { 
        firstname:"${testUser.firstname}"
        lastname:"${testUser.lastname}"
        email:"${testUser.email}"
        password:"${testUser.password}" 
        rePassword:"${testUser.password}"
      }) {
        id
        firstname
        lastname
        token
      }
    }
  `),
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
