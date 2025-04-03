
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     SavedSearch:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Saved search ID
 *         location:
 *           type: string
 *           description: Search location
 *         propertyType:
 *           type: string
 *           description: Property type filter
 *         status:
 *           type: string
 *           description: Property status filter (sale/rent)
 *         minPrice:
 *           type: number
 *           description: Minimum price filter
 *         maxPrice:
 *           type: number
 *           description: Maximum price filter
 *         bedrooms:
 *           type: number
 *           description: Minimum number of bedrooms
 *         notifyByEmail:
 *           type: boolean
 *           description: Whether to send email notifications
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the search was saved
 *     
 *     UserPreference:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: Preference ID
 *         user:
 *           type: string
 *           description: User ID reference
 *         savedSearches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SavedSearch'
 *         recentSearches:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               params:
 *                 type: object
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *         notifications:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               read:
 *                 type: boolean
 *               createdAt:
 *                 type: string
 *                 format: date-time
 */
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
