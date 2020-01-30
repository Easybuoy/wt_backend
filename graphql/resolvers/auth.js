const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, defaultProfilePicture } = require('../../config');
const {
  authenticateFacebook,
  authenticateGoogle,
  authenticateGoogleId
} = require('../../middleware/passport');

const User = require('../../models/user');
const { createUnitDL: UnitDataLoader } = require('../dataloaders/unit');
const { sendMail, ACCOUNT_RECOVERY } = require('../../helpers/helpers');

const genAuthResponse = (user, remember = false) => ({
  id: user.id,
  firstname: user.firstname,
  lastname: user.lastname,
  token: user.generateJWT(remember),
  isNewUser: !user.goal,
});

const accountRecoveryMessage = (token) => ({
  topic: `Link To Reset Password_${token}`,
  message: 'You are receiving this because you (or someone else) have requested a password reset.\n\n'
    + 'Please click this button to complete the process within 15 minutes.\n\n'
    + 'If you did not request this, kindly ignore this email to keep your password unchanged.\n'
});

module.exports = {
  Query: {
    authForm: async (_, { input: { email, password, remember } }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User does not exist!');
      }
      const isValidPassword = await user.validPassword(password);
      if (!isValidPassword) {
        throw new Error('Password is incorrect!');
      }
      return genAuthResponse(user, remember);
    },
    user: async (_, { input }, context) => {
      const userId = context.user.id;
      const user = await User.findById(userId);
      return user;
    },
    accountRecovery: async (_, { input }, context) => {
      if (!input) {
        throw new Error('Enter registered email to update password!');
      } else {
        const user = await User.findOne({ email: input });
        if (user) {
          const token = jwt.sign(
            { id: user.id, firstname: user.firstname },
            jwtSecret,
            { expiresIn: '20m' }
          );
          sendMail(accountRecoveryMessage(token), user, ACCOUNT_RECOVERY);
          return user;
        } throw new Error('Email not found in database!');
      }
    }
  },
  Mutation: {
    addUser: async (_, { input }) => {
      try {
        const userAlreadyExists = await User.findOne({ email: input.email });
        if (userAlreadyExists) {
          throw new Error('User exists already.');
        }

        const user = new User({
          ...input,
          photo: defaultProfilePicture
        });

        const savedUser = await user.save();

        return genAuthResponse(savedUser);
      } catch (err) {
        throw err;
      }
    },
    authFacebook: async (_, { input: { accessToken } }, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };
      try {
        // data contains the accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateFacebook(req, res);
        if (data) {
          const user = await User.asFacebookUser(data);
          if (user) {
            return genAuthResponse(user, true);
          }
        }
        if (info) {
          switch (info.code) {
            case 'ETIMEDOUT':
              return (new Error('Failed to reach Facebook: Try Again'));
            default:
              return (new Error('Something went wrong while logging in with your account!'));
          }
        }
        return (new Error('Server error'));
      } catch (error) {
        return error;
      }
    },
    authGoogle: async (_, { input: { accessToken, idToken } }, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
        id_token: idToken,
      };
      try {
        if (!accessToken && idToken) {
          const { data, info } = await authenticateGoogleId(req, res);
          if (data) {
            const user = await User.asGoogleIdUser(data, idToken);
            if (user) {
              return genAuthResponse(user, true);
            }
          }
          if (info) {
            switch (info.code) {
              case 'ETIMEDOUT':
                return (new Error('Failed to reach Google: Try Again'));
              default:
                return (new Error('Something went wrong while logging in with your account!'));
            }
          }
          return (new Error('Server error'));
        }
        // data contains the accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateGoogle(req, res);
        if (data) {
          const user = await User.asGoogleUser(data);
          if (user) {
            return genAuthResponse(user, true);
          }
        }
        if (info) {
          switch (info.code) {
            case 'ETIMEDOUT':
              return (new Error('Failed to reach Google: Try Again'));
            default:
              return (new Error('Something went wrong while logging in with your account!'));
          }
        }
        return (new Error('Server error'));
      } catch (error) {
        return error;
      }
    },
    updateUser: async (_, { input }, context) => {
      const newData = { ...input };
      delete newData.id;
      try {
        const updatedUser = await User.findByIdAndUpdate(context.user.id, newData, { new: true });
        if (updatedUser) {
          return { ...updatedUser._doc, password: null, id: updatedUser.id };
        }
        throw new Error('Could not update user!');
      } catch (err) {
        throw err;
      }
    },
    resetPassword: async (_, { input }, context) => {
      if (!input.password) {
        throw new Error('Field is empty');
      } else {
        let user = await User.findById(context.user.id);
        if (user) {
          user = User.findByIdAndUpdate(
            context.user.id,
            { password: await bcrypt.hash(input.password, 12) },
            { new: true }
          );
          return user;
        } throw new Error('An error occured');
      }
    }
  },
  User: {
    heightUnit: ({ heightUnit }, args, context) => UnitDataLoader(context).load(heightUnit),
    weightUnit: ({ weightUnit }, args, context) => UnitDataLoader(context).load(weightUnit),
  }
};
