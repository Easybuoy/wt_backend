const DataLoader = require('dataloader');
const Unit = require('../../models/unit');

const unitDataLoader = (unitIds) => Unit.find({ _id: { $in: unitIds } }).then(
  (units) => unitIds.map((unitId) => units.filter((unit) => unit.id === unitId.toString())[0])
);

module.exports = (context) => {
  const ctx = context;
  if (!ctx.unitDataLoader) {
    ctx.unitDataLoader = new DataLoader(unitDataLoader);
  }
  return ctx.unitDataLoader;
};
