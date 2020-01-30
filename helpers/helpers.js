/* eslint-disable no-console */
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { isProduction, smtpUser, smtpPass } = require('../config');
const cloudinary = require('./cloudinary');

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

const SCHEDULED_WORKOUTS = 'scheduledWorkoutAlerts';
const FRIEND_REQUEST = 'friendRequests';
const ACCOUNT_RECOVERY = 'accountRecoveries';

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
  searchBy: (input, query = {}) => {
    let filter = null;
    if (input && input.search && input.fields.length) {
      filter = { $or: [], ...query };
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
  SCHEDULED_WORKOUTS,
  FRIEND_REQUEST,
  sendNotification: async (notification, pubsub, subscription) => {
    switch (subscription) {
      case SCHEDULED_WORKOUTS:
        pubsub.publish(subscription, {
          scheduledWorkoutAlert: { ...notification._doc, id: notification.id }
        });
        return true;
      case FRIEND_REQUEST:
        pubsub.publish(subscription, {
          friendRequest: { ...notification._doc, id: notification.id }
        });
        return true;
      default:
        return false;
    }
  },
  sendMail: async (notification, user, subscription) => {
    console.log('sendmail called');
    let buttonAction = null;
    switch (subscription) {
      case SCHEDULED_WORKOUTS:
        buttonAction = {
          link: `http://app.trackdrills.com/workout/${notification.topic.split('_')[1]}`,
          text: 'Scheduled workouts'
        };
        break;
      case FRIEND_REQUEST:
        buttonAction = {
          link: 'http://app.trackdrills.com/friends/requests',
          text: 'View friend requests'
        };
        break;
      case ACCOUNT_RECOVERY:
        buttonAction = {
          link: `http://app.trackdrills.com/accountrecovery/${notification.topic.split('_')[1]}`,
          text: 'Reset Password'
        };
        break;
      default:
        break;
    }
    await transporter.verify();
    await transporter.sendMail({
      from: smtpUser,
      to: user.email,
      subject: notification.topic.split('_')[0],
      text: notification.message,
      html: mailGenerator.generate({
        body: {
          name: user.firstname,
          intro: notification.topic,
          action: {
            instructions: notification.message,
            button: {
              color: '#22BC66',
              text: buttonAction.text,
              link: buttonAction.link
            }
          },
          outro: 'Good luck!'
        }
      }),
      // eslint-disable-next-line no-unused-vars
    }, (err, info) => {
      if (err) console.error(err.message);
    });
  },
  uploadFile: async (file) => {
    try {
      let image = await file;
      // eslint-disable-next-line no-console
      console.log('await file before upload', image);
      const upload = new Promise((resolves, rejects) => {
        const { filename, mimetype, createReadStream } = image;
        let filesize = 0;
        const stream = createReadStream();
        stream.on('data', (chunk) => {
          filesize += chunk.length;
        });
        stream.once('end', () => resolves({
          filename,
          mimetype,
          filesize,
          path: stream.path
        }));
        stream.on('error', rejects);
      });
      image = await upload;
      // eslint-disable-next-line no-console
      console.log('await upload', image);
      const allowedFileTypes = ['image/jpeg', 'image/png'];
      if (!allowedFileTypes.includes(image.mimetype)) throw new Error('Invalid file mimetype');
      if (image.filesize > 1000000) throw new Error('File exceeded maximum allowed size');
      image = await cloudinary(image.path);
      // eslint-disable-next-line no-console
      console.log('await cloudinary', image);
      return image;
    } catch (err) {
      throw new Error(err.message);
    }
  }
};
