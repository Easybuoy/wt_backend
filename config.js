require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  MONGO_CONNECT,
  JWT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  GOOGLE_APP_ID,
  GOOGLE_APP_SECRET,
  GRAPHIQL_PLAYGROUND,
} = process.env;

module.exports = {
  isProduction: NODE_ENV === 'production',
  env: NODE_ENV || 'development',
  port: PORT,
  jwtSecret: JWT_SECRET,
  mongoConnect: MONGO_CONNECT,
  facebookAppId: FACEBOOK_APP_ID,
  facebookAppSecret: FACEBOOK_APP_SECRET,
  googleAppId: GOOGLE_APP_ID,
  googleAppSecret: GOOGLE_APP_SECRET,
  graphiql: GRAPHIQL_PLAYGROUND,
};
