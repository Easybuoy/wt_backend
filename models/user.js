const config = require('../config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

mongoose.promise = global.Promise;
mongoose.set('debug', config.env !== 'production');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  google: {
    id: String,
    token: String,
  },
  facebook: {
    id: String,
    token: String,
  },
});

UserSchema.pre('save', async function (next, data) {
  const user = this;
  if (!user.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;
  next();
});

UserSchema.methods.generateJWT = () => {
  return jwt.sign({
    email: this.email,
    id: this._id,
  }, config.jwtSecret, {
    expiresIn: '1h'
  });
}

UserSchema.methods.validPassword = async (password) => {
  const isEqual = await bcrypt.compare(password, this.password);
  return isEqual;
}

UserSchema.statics.asFacebookUser = async function ({ accessToken, refreshToken, profile }) {
  const User = this;
  const user = await User.findOne({ 'facebook.id': profile.id });
  if (!user) { // no user was found, lets create a new one
    const newUser = await User.create({
      name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
      email: profile.emails[0].value,
      facebook: {
        id: profile.id,
        token: accessToken,
      },
    });

    return newUser;
  }
  return user;
};

UserSchema.statics.asGoogleUser = async function ({ accessToken, refreshToken, profile }) {
  const User = this;
  const existingUser = await User.findOne({ 'google.id': profile.id });
  if (!existingUser) { // no user was found, lets create a new one
    const newUser = await User.create({
      name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
      email: profile.emails[0].value,
      google: {
        id: profile.id,
        token: accessToken,
      },
    });
    return newUser;
  }
  return existingUser;
};

module.exports = mongoose.model('User', UserSchema);