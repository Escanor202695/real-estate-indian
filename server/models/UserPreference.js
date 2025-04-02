
const mongoose = require('mongoose');

const SearchAlertSchema = new mongoose.Schema({
  location: String,
  propertyType: String,
  status: String,
  minPrice: Number,
  maxPrice: Number,
  bedrooms: Number,
  notifyByEmail: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  savedSearches: [SearchAlertSchema],
  recentSearches: [{
    query: String,
    params: Object,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  notifications: [{
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('UserPreference', UserPreferenceSchema);
