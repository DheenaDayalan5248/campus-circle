const mongoose = require('mongoose');

const madeBySchema = new mongoose.Schema({
  developerName: {
    type: String,
    required: true
  },
  github: {
    type: String,
    required: true
  },
  instagram: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  email: String,
  portfolio: String
}, { 
  timestamps: true 
});

module.exports = mongoose.model('MadeBy', madeBySchema);



