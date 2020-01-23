const { UserInputError } = require('apollo-server-express');
const PasswordValidator = require('password-validator');
const { isEmail } = require('validator');

const passwordSchema = new PasswordValidator()
  .is().min(8)
  .is()
  .max(20)
  .has()
  .letters()
  .has()
  .digits()
  .has()
  .symbols()
  .has()
  .not()
  .spaces();

const validators = {
  Mutation: {
    addUser: (resolve, parent, args, context) => {
      const { email, password, rePassword } = args.input;
      if (!isEmail(email)) {
        throw new UserInputError('Invalid Email address!');
      }
      if (password !== rePassword) {
        throw new UserInputError('Passwords don\'t match!');
      }
      if (!passwordSchema.validate(password)) {
        throw new UserInputError('Password is not strong enough!');
      }
      return resolve(parent, args, context);
    },
    resetPassword: (resolve, parent, args, context) => {
      const { password, rePassword } = args.input;
      if (password !== rePassword) {
        throw new UserInputError('Passwords don\'t match!');
      }
      if (!passwordSchema.validate(password)) {
        throw new UserInputError('Password is not strong enough!');
      }
      return resolve(parent, args, context);
    }
  }
};

module.exports = validators;
