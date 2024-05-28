const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: String,
    required: true
  },
  matchesPlayed: {
    type: Number,
    required: true
  },
  goalsScored: {
    type: Number,
    required: true
  },
  goalsReceived: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

const Ranking = mongoose.model('Ranking', rankingSchema);

module.exports = Ranking;
