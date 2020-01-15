const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const { Schema } = mongoose;

const ScheduleSchema = new Schema({
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
    default: Date.now()
  },
  routine: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
