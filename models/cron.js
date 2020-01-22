const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const CronSchema = new Schema({
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  startDate: {
    type: Number,
    required: true,
  },
  reminderTime: {
    type: Number,
    required: true,
    default: 30
  },
  routine: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Cron', CronSchema);
