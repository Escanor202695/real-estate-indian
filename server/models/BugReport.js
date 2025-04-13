
const mongoose = require('mongoose');

const BugReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a bug title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a bug description'],
  },
  steps: {
    type: String,
    required: false
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reporterName: {
    type: String,
    required: [true, 'Please provide your name']
  },
  reporterEmail: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('BugReport', BugReportSchema);
