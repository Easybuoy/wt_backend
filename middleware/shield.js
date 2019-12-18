const {
  rule, shield, allow
} = require('graphql-shield');

const isAuthenticated = rule()(
  async (parent, args, context) => context.user !== null
);

const permissions = shield(
  {
    Query: {
      authForm: allow,
    },
    Mutation: {
      addUser: allow,
      authGoogle: allow,
      authFacebook: allow,
    },
  },
  {
    debug: true,
    allowExternalErrors: true,
    fallbackError: 'Unauthorized!',
    fallbackRule: isAuthenticated,
  }
);

module.exports = permissions;
