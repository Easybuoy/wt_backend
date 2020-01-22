const {
  authenticateFacebook,
  authenticateGoogle
} = require('../../middleware/passport');

const User = require('../../models/user');
const { createUnitDL: UnitDataLoader } = require('../dataloaders/unit');

const genAuthResponse = (user, remember = false) => ({
  id: user.id,
  firstname: user.firstname,
  lastname: user.lastname,
  token: user.generateJWT(remember),
  isNewUser: !user.goal,
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
      const userId = context.user.id
      const user = await User.findById(userId);
      return user;
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
          ...input
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
    authGoogle: async (_, { input: { accessToken } }, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken,
      };
      try {
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
    }
  },
  User: {
    heightUnit: ({ heightUnit }, args, context) => UnitDataLoader(context).load(heightUnit),
    weightUnit: ({ weightUnit }, args, context) => UnitDataLoader(context).load(weightUnit),
  }
};
