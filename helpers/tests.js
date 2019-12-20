/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../api/server');
const connect = require('../api/database');
const { dropAllCollections, removeAllCollections } = require('./helpers');


module.exports = {
  initTest: () => {
    // wait for the DB to connect
    beforeAll(async () => {
      await connect;
    });

    // clear all collection rows
    afterEach(async () => {
      await removeAllCollections();
    });

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
    });
    return true;
  },
  query: (query) => request(server).post('/api').send({ query }),
  dropAllCollections
};
