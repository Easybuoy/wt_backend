require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  MONGO_CONNECT,
  MONGO_CONNECT_TEST,
  JWT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  GOOGLE_APP_ID,
  GOOGLE_APP_SECRET,
  GRAPHIQL_PLAYGROUND,
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

module.exports = {
  isTesting: NODE_ENV === 'testing',
  isProduction: NODE_ENV === 'production',
  env: NODE_ENV || 'development',
  port: PORT,
  jwtSecret: JWT_SECRET,
  mongoConnect: MONGO_CONNECT,
  mongoConnectTest: MONGO_CONNECT_TEST,
  facebookAppId: FACEBOOK_APP_ID,
  facebookAppSecret: FACEBOOK_APP_SECRET,
  googleAppId: GOOGLE_APP_ID,
  googleAppSecret: GOOGLE_APP_SECRET,
  graphiql: GRAPHIQL_PLAYGROUND,
  cloudName: CLOUD_NAME,
  cloudinaryApiKey: CLOUDINARY_API_KEY,
  cloudinaryApiSecret: CLOUDINARY_API_SECRET,
};
