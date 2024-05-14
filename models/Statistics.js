const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  goals: {
    type: Number,
    default: 0
  },
  assists: {
    type: Number,
    default: 0
  }
});

const Statistics = mongoose.model('Statistics', statisticsSchema);

module.exports = Statistics;
