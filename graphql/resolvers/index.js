const authResolver = require('./auth');
const unitResolver = require('./unit');
const workoutResolver = require('./workout');
const exerciseResolver = require('./exercise');
const scheduleResolver = require('./schedule');

const rootResolver = [
  authResolver,
  unitResolver,
  workoutResolver,
  exerciseResolver,
  scheduleResolver
].reduce((rootR, resolver) => {
  const finalResolver = rootR;
  Object.keys(resolver).forEach((key) => {
    if (!finalResolver[key]) {
      finalResolver[key] = {};
    }
    finalResolver[key] = {
      ...finalResolver[key],
      ...resolver[key]
    };
  });
  return finalResolver;
}, {});


module.exports = rootResolver;
