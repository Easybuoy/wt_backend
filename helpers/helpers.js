const mongoose = require('mongoose');
const { isProduction } = require('../config');

module.exports = {
  removeAllCollections: async (excludeCollections = []) => {
    let collections = await mongoose.connection.db.listCollections().toArray();
    collections = collections.map((collection) => collection.name);
    await Promise.all(collections
      .map((colname) => {
        if (isProduction && excludeCollections.includes(colname)) return Promise.resolve();
        try {
          return mongoose.connection.db.dropCollection(colname);
        } catch (err) {
          if (err.message.includes('ns not found')) return Promise.resolve();
          if (err.message.includes('a background operation is currently running')) Promise.resolve();
          throw new Error(err.message);
        }
      }));
  },
  searchBy: (input) => {
    let filter = null;
    if (input && input.search && input.fields.length) {
      filter = { $or: [] };
      input.fields.forEach((field) => {
        filter.$or.push({
          [field]: {
            $regex: input.search,
            $options: 'gi'
          }
        });
      });
    }
    return filter;
  }
};
