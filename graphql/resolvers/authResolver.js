const bcrypt = require('bcryptjs');

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
      });

      const savedUser = await user.save();

      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (err) {
      throw err;
    }
  },

};
