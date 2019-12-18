const {
  authenticateFacebook,
  authenticateGoogle
} = require('../../middleware/passport');

const User = require('../../models/user');

const genAuthResponse = (user, remember = false) => ({
  id: user.id,
  name: user.name,
  token: user.generateJWT(remember),
  isNewUser: !user.goal,
});

module.exports = {
  Query: {
    // Login with a normal form
    authForm: async (_, { input: { email, password, remember } }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User does not exist!');
      }
      if (!user.validPassword(password)) {
        throw new Error('Password is incorrect!');
      }
      return genAuthResponse(user, remember);
    },
  },
  Mutation: {
    // Sign up with a normal form
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

        return { ...savedUser._doc, password: null, _id: savedUser.id };
      } catch (err) {
        throw err;
      }
    },
    // Sign up / Login with a facebook account
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
            return genAuthResponse(user);
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
    // Sign up / Login with a google account
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
            return genAuthResponse(user);
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
    //
    updateUser: async (_, { input }) => {
      // find user by id
      // if user doesn't exist, return error
      // update user based on input
      // return the updated user
      const newData = { ...input };
      delete newData.id;
      try {
        const updatedUser = await User.findByIdAndUpdate(input.id, newData, { new: true });
        return { ...updatedUser._doc, password: null, _id: updatedUser.id };
      } catch (err) {
        throw err;
      }
    }
  }
};
