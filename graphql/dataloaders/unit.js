const DataLoader = require('dataloader');
const Unit = require('../../models/unit');

function unitDataLoader(unitIds) {
  return Unit.find({ _id: { $in: unitIds } }).then((units) => unitIds.map(
    (unitId) => units.find((unit) => unit.id === unitId.toString())
  ));
}

function createUnitDL(context) {
  const ctx = context;
  if (!ctx.unitDataLoader) {
    // eslint-disable-next-line no-use-before-define
    ctx.unitDataLoader = new DataLoader(exportFunctions.unitDataLoader);
  }
  return ctx.unitDataLoader;
}

// the use of this object facilitates dataloader testing / spy & mock functions
const exportFunctions = {
  unitDataLoader,
  createUnitDL
};

module.exports = exportFunctions;
