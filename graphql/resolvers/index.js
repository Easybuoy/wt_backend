const authResolver = require('./auth');
const unitResolver = require('./unit');

const rootResolver = [
  authResolver,
  unitResolver
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
