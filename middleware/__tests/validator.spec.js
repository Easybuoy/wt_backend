const { initTest, query } = require('../../helpers/tests');
const Validator = require('../validator');
const { UserInputError } = require('apollo-server-express');

initTest();

describe('Validator  middleware', () => {
    it('Should throw invalid email', async (done) => {
      const arg = { input: {
        email: 'email.email.com',
        password: 'secret',
        rePassword: 'secret'
      } }
      expect(() => {
        Validator.Mutation.addUser(() => true, null, arg, null)
      }).toThrow(UserInputError);
      done();
    });
  });
  