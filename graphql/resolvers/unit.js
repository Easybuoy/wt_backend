const Unit = require('../../models/unit');

module.exports = {
  Query: {
    units: async () => {
      const units = await Unit.find();
      return units;
    },
    unitById: async (_, { id }) => {
      const unit = await Unit.findById(id);
      return { ...unit._doc, id: unit.id };
    }
  },
  Mutation: {

  }
};
