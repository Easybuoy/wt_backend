/* eslint-disable no-console */
const { dropAllCollections } = require('./helpers');
const connect = require('../api/database');
const { isProduction } = require('../config');
const User = require('../models/user');
const Unit = require('../models/unit');

module.exports = async (onEnd = false) => {
  console.log('Connecting to database...');
  await connect;
  console.log('Dropping all collections...');
  await dropAllCollections((isProduction ? ['users'] : []));

  const users = [
    {
      firstname: 'Test',
      lastname: 'User 1',
      email: 'test@user1.com',
      password: 'testUser1!'
    },
    {
      firstname: 'Test',
      lastname: 'User 2',
      email: 'test@user2.com',
      password: 'testUser2!'
    },
    {
      firstname: 'Test',
      lastname: 'User 3',
      email: 'test@user3.com',
      password: 'testUser3!'
    },
  ];

  const units = [
    { name: 'kg', type: 'weight' },
    { name: 'pounds', type: 'weight' },
    { name: 'inches', type: 'height' },
    { name: 'centimetres', type: 'height' },
  ];

  if (!isProduction) {
    console.log('Seeding users collection...');
    await User.create(users);
  }
  console.log('Seeding units collection...');
  await Unit.create(units);

  console.log('Successfully seeded the database!');
  return onEnd ? onEnd() : true;
};
