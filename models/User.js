const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  birthdate: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['player', 'coach', 'admin']
  },
  password: {
    type: String,
    required: true,
    minlength: 7
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false
  }],
  sessions: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: false 
  }]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
