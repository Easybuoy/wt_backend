const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../../models/user');

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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
        password: hashedPassword
      });

      const savedUser = await user.save();

      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (err) {
      throw err;
    }
  },
  login: async () => {

    return {}
  }
};