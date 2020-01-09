const mongoose = require('mongoose');
const { isProduction } = require('../config');

module.exports = {
  removeAllCollections: async (excludeCollections = []) => {
    const collections = Object.keys(mongoose.connection.collections);
    await Promise.all(collections
      .map((colname) => {
        if (isProduction && excludeCollections.includes(colname)) return false;
        try {
          mongoose.connection.collections[colname].drop();
          return true;
        } catch (err) {
          if (err.message.includes('ns not found')) return false;
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
