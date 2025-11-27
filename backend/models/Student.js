const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  dob: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  batch: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  hasLoggedIn: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Student', studentSchema);



