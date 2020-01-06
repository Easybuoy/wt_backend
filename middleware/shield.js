const {
  rule, shield, allow
} = require('graphql-shield');

const isAuthenticated = rule()(
  async (parent, args, context) => context.user !== null
);

const permissions = shield(
  {
    Query: {
      '*': isAuthenticated,
      units: allow,
      authForm: allow,
    },
    Mutation: {
      '*': isAuthenticated,
      addUser: allow,
      authGoogle: allow,
      authFacebook: allow,
    },
  },
  {
    debug: true,
    allowExternalErrors: true,
    fallbackError: 'Not Authorized!',
  }
);

module.exports = permissions;
