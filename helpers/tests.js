/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const mongoose = require('mongoose');
const passport = require('passport');
const server = require('../api/server');
const connect = require('../api/database');
const { removeAllCollections } = require('./helpers');


passport.authenticate = jest.fn((authType, options, callback) => () => {
  callback(null, {
    accessToken: true,
    profile: {
      id: 12345,
      displayName: 'Test',
      familyName: 'User',
      emails: [{ value: 'test@user1.com' }]
    }
  }, null);
});

module.exports = {
  initTest: () => {
    // wait for the DB to connect
    beforeAll(() => connect);

    // clear all collection rows
    afterEach(() => removeAllCollections());

    // Disconnect Mongoose
    afterAll(async () => {
      await removeAllCollections();
      await mongoose.connection.close();
    });
    return true;
  },
  query: (query, authToken = '') => request(server).post('/api').send({ query }).set('Authorization', authToken),
};
