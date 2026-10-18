const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteTitle: {
    type: String,
    required: true,
    trim: true
  },
  noteDescription: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM'
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema);