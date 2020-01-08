const mongoose = require('mongoose');
const { isProduction } = require('../config');

module.exports = {
  removeAllCollections: async (excludeCollections = []) => {
    const collections = Object.keys(mongoose.connection.collections);
    await Promise.all(collections
      .map((colname) => {
        if (isProduction && excludeCollections.includes(colname)) return false;
        return mongoose.connection.collections[colname].deleteMany();
      }));
  },
  searchBy: (input) => {
    let filter = null;
    if (input && input.search && input.field.length) {
      filter = { $or: [] };
      input.field.forEach((field) => {
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
