const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Match', 'Training', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    required: true
  },
  location: String,
  score: String,
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'],
      required: true
    }
  }],
  description: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;