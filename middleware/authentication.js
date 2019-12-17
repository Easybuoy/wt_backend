const config = require('../config');
const express = require('express');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google').Strategy;
const FacebookStrategy = require('passport-facebook');

const User = require('../models/user');

passport.use('jwt', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwtSecret
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

passport.use('google', new GoogleStrategy(
  {
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  async (identifier, done) => {
    await User.findOrCreate({ googleId: identifier }, (err, user) => {
      return done(err, user);
    });
  }
));

passport.use('facebook', new FacebookStrategy(
  {
    clientID: config.facebookAppId,
    clientSecret: config.facebookAppSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    await User.findOrCreate({ facebookId: profile.id }, (err, user) => {
      return cb(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
  console.log('serializedUser', user)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializedUser', id)
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const authMiddleware = express();
authMiddleware.use(passport.initialize());
authMiddleware.use(passport.session());
module.exports = authMiddleware;