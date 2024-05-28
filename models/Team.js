const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  coaches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  accessCode: {
    type: String,
    required: true,
    unique: true
  }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
