/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../api/server');
const connect = require('../api/database');

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  await collections.map((colname) => mongoose.connection.collections[colname])
    .forEach((col) => col.deleteMany());
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  await collections.map((colname) => {
    const collection = mongoose.connection.collections[colname];
    try {
      return collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return false;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return false;
      throw new Error(error.message);
    }
  });
}

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
  query: (query) => request(server).post('/api').send({ query })
};
