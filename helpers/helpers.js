const mongoose = require('mongoose');

module.exports = {
  removeAllCollections: async () => {
    const collections = Object.keys(mongoose.connection.collections);
    await collections
      .map((colname) => mongoose.connection.collections[colname])
      .forEach(async (col) => {
        await col.deleteMany();
      });
  },
  dropAllCollections: async () => {
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
};
