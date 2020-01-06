const mongoose = require('mongoose');
const { isProduction } = require('../config');

module.exports = {
  removeAllCollections: async (excludeCollections = []) => {
    const collections = Object.keys(mongoose.connection.collections);
    await collections
      .map((colname) => {
        if (isProduction && excludeCollections.includes(colname)) {
          return false;
        }
        return mongoose.connection.collections[colname];
      })
      .forEach(async (col) => {
        await col.deleteMany();
      });
  },
  dropAllCollections: async (excludeCollections = []) => {
    const collections = Object.keys(mongoose.connection.collections);
    await collections.map((colname) => {
      if (isProduction && excludeCollections.includes(colname)) {
        return false;
      }
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
};
