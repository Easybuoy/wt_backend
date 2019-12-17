const config = require('../config');
const User = require('../models/user');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');

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

module.exports = { authenticateFacebook, authenticateGoogle };