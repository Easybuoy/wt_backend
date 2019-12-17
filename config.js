require('dotenv').config();
const {
  PORT,
  MONGO_CLUSTER,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB,
  NODE_ENV,
  JWT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = process.env;

module.exports = {
  env: NODE_ENV ? NODE_ENV : 'development',
  port: PORT,
  jwtSecret: JWT_SECRET,
  mongoCluster: MONGO_CLUSTER,
  mongoUser: MONGO_USER,
  mongoPassword: MONGO_PASSWORD,
  mongoDatabase: MONGO_DB,
  facebookAppId: FACEBOOK_APP_ID,
  facebookAppSecret: FACEBOOK_APP_SECRET,
}