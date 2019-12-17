const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/user');

module.exports = {
  createUser: async ({ input }) => {
    try {
      const userAlreadyExists = await User.findOne({ email: input.email });
      if (userAlreadyExists) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(input.password, 12);

      const user = new User({
        email: input.email,
        password: hashedPassword,
        type: input.type,
      });

      const savedUser = await user.save();

      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ input }, context, info) => {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(input.password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { 
        type: user.type, 
        userId: user.id, 
        email: user.email
      },
      config.jwtSecret,
      { 
        expiresIn: '1h'
      }
    );
    return { id: user.id, token: token, tokenExpiration: 1 };
  }
};