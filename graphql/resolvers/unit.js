const Unit = require('../../models/unit');

module.exports = {
  Query: {
    units: async () => {
      const units = await Unit.find();
      return units;
    }
  },
  Mutation: {

  }
};
