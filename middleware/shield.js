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
      unitById: allow,
      authForm: allow,
      accountRecovery: allow,
    },
    Mutation: {
      '*': isAuthenticated,
      addUser: allow,
      authGoogle: allow,
      authFacebook: allow,
      pushNotification: allow,
    },
    Subscription: {
      '*': allow
    }
  },
  {
    debug: true,
    allowExternalErrors: true,
    fallbackError: 'Not Authorized!',
  }
);

module.exports = permissions;
