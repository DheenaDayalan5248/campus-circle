const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);



