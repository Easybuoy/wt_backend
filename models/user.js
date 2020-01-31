const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, defaultProfilePicture } = require('../config');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstname: {
    type: String,
  },
  lastname: {
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
  height: {
    type: Number,
  },
  heightUnit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  },
  weight: {
    type: Number,
  },
  weightUnit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  },
  goal: {
    type: String,
  },
  equipment: {
    type: Boolean,
  },
  experience: {
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
  photo: {
    type: String
  },
  reminderType: {
    type: String,
    default: 'notification'
  }
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;
  return next();
});

UserSchema.methods.generateJWT = function (remember = false) {
  return jwt.sign({ id: this._id, firstname: this.firstname }, jwtSecret, (!remember ? { expiresIn: '1h' } : null));
};

UserSchema.methods.validPassword = async function (password) {
  let isEqual = false;
  if (this.password) {
    isEqual = await bcrypt.compare(password, this.password);
  } else {
    throw new Error('Password not connected. Login with your google/facebook account!');
  }
  return isEqual;
};

// refreshToken is also available along with the accessToken
UserSchema.statics.asFacebookUser = async function ({ accessToken, profile }) {
  const User = this;
  const user = await User.findOne({ 'facebook.id': profile.id });
  // no user was found, create a new one
  if (!user) {
    const newUser = await User.create({
      firstname: profile.displayName || profile.givenName,
      lastname: profile.familyName,
      email: profile.emails[0].value,
      facebook: {
        id: profile.id,
        token: accessToken,
      },
      photo: profile._json.picture
        || defaultProfilePicture,
    });
    return newUser;
  }
  return user;
};

// refreshToken is also available along with the accessToken
UserSchema.statics.asGoogleUser = async function ({ accessToken, profile }) {
  const User = this;
  const existingUser = await User.findOne({ 'google.id': profile.id });
  // no user was found, create a new one
  if (!existingUser) {
    const newUser = await User.create({
      firstname: profile.displayName || profile.givenName,
      lastname: profile.familyName,
      email: profile.emails[0].value,
      google: {
        id: profile.id,
        token: accessToken,
      },
      photo: profile._json.picture
        || defaultProfilePicture,
    });
    return newUser;
  }
  return existingUser;
};


UserSchema.statics.asGoogleIdUser = async function (data, idToken) {
  const User = this;
  const { googleId, parsedToken: { payload } } = data;
  const existingUser = await User.findOne({ 'google.id': googleId });
  // no user was found, create a new one
  if (!existingUser) {
    const newUser = await User.create({
      firstname: payload.given_name || payload.name,
      lastname: null,
      email: payload.email,
      google: {
        id: googleId,
        token: idToken,
        idToken
      },
      photo: payload.picture || defaultProfilePicture,
    });
    return newUser;
  }
  return existingUser;
};

module.exports = mongoose.model('User', UserSchema);
