const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');
const GoogleIdTokenStrategy = require('passport-google-id-token');
const config = require('../config');

const FacebookTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
  accessToken,
  refreshToken,
  profile,
});

passport.use(new FacebookTokenStrategy(
  {
    clientID: config.facebookAppId,
    clientSecret: config.facebookAppSecret,
  },
  FacebookTokenStrategyCallback
));

const GoogleTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
  accessToken,
  refreshToken,
  profile,
});

passport.use(new GoogleTokenStrategy(
  {
    clientID: config.googleAppId,
    clientSecret: config.googleAppSecret,
  },
  GoogleTokenStrategyCallback
));

const GoogleIdTokenStrategyCallback = (parsedToken, googleId, done) => done(null, {
  parsedToken,
  googleId
});

passport.use(new GoogleIdTokenStrategy(
  {
    clientID: config.googleAppId,
  },
  GoogleIdTokenStrategyCallback
));

const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('facebook-token', { session: false }, (err, data, info) => {
    if (err) reject(err);
    resolve({ data, info });
  })(req, res);
});

const authenticateGoogle = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('google-token', { session: false }, (err, data, info) => {
    if (err) reject(err);
    resolve({ data, info });
  })(req, res);
});

const authenticateGoogleId = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('google-id-token', { session: false }, (err, data, info) => {
    if (err) reject(err);
    resolve({ data, info });
  })(req, res);
});

module.exports = {
  authenticateFacebook,
  authenticateGoogle,
  authenticateGoogleId
};
