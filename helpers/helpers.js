/* eslint-disable no-console */
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { isProduction, smtpUser, smtpPass } = require('../config');

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Trackdrills',
    link: 'http://app.trackdrills.com/',
    logo: 'http://trackdrills.com/assets/images/logo.png'
  }
});

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  removeAllCollections: async (excludeCollections = []) => {
    let collections = await mongoose.connection.db.listCollections().toArray();
    collections = collections.map((collection) => {
      if (collection.name.includes('indexes')) return false;
      return collection.name;
    }).filter((name) => name !== false);
    await Promise.all(collections
      .map((colname) => {
        if (isProduction && excludeCollections.includes(colname)) return Promise.resolve();
        try {
          return mongoose.connection.db.dropCollection(colname);
        } catch (err) {
          if (err.message.includes('ns not found')) return Promise.resolve();
          if (err.message.includes('a background operation is currently running')) Promise.resolve();
          throw new Error(err.message);
        }
      }));
  },
  searchBy: (input) => {
    let filter = null;
    if (input && input.search && input.fields.length) {
      filter = { $or: [] };
      input.fields.forEach((field) => {
        if (input.fields[0].includes('Id')) {
          filter.$or.push({
            [field]: new ObjectId(input.search)
          });
        } else {
          filter.$or.push({
            [field]: {
              $regex: input.search,
              $options: 'gi'
            },
            userId: null
          });
        }
      });
    }
    return filter;
  },
  sendMail: async (notification, user) => {
    console.log('sendmail called');
    await transporter.verify();
    await transporter.sendMail({
      from: smtpUser,
      to: user.email,
      subject: notification.topic,
      text: notification.message,
      html: mailGenerator.generate({
        body: {
          name: user.firstname,
          intro: notification.topic,
          action: {
            instructions: notification.message,
            button: {
              color: '#22BC66',
              text: 'Scheduled workouts',
              link: `http://app.trackdrills.com/workout/${notification.topic.split('_')[1]}`
            }
          },
          outro: 'Good luck!'
        }
      }),
    // eslint-disable-next-line no-unused-vars
    }, (err, info) => {
      if (err) console.error(err.message);
    });
  }
};
