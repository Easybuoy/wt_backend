const config = require('../config');
const passport = require('passport');
const graphQLHttp = require('express-graphql');
const schema = require('../graphql/schema');
const rootValue = require('../graphql/resolvers');
const User = require('../models/user');

module.exports = graphQLHttp((req, res) => {
  return new Promise((resolve, reject) => {
    const next = (user, info = {}) => {
      resolve({
        schema,
        rootValue,
        graphiql: config.env !== 'production',
        context: {
          user: user || null,
        },
      });
    };
    next();
    if (req.body.type) {
      passport.authenticate(req.body.type, { session: false }, (err, user, errors, status) => {
        console.log(err, user, errors, status);
        next(user);
      })(req, res, next);
    } else {
      next(false);
    }
  });
});