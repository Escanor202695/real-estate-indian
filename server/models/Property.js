
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - type
 *         - status
 *         - price
 *         - size
 *       properties:
 *         _id:
 *           type: string
 *           description: Property ID
 *         title:
 *           type: string
 *           description: Property title
 *         description:
 *           type: string
 *           description: Detailed property description
 *         type:
 *           type: string
 *           enum: [flat, villa, house, plot, commercial, pg]
 *           description: Type of property
 *         status:
 *           type: string
 *           enum: [sale, rent]
 *           description: Whether for sale or rent
 *         price:
 *           type: number
 *           description: Property price
 *         size:
 *           type: number
 *           description: Size in square feet
 *         bedrooms:
 *           type: number
 *           description: Number of bedrooms
 *         bathrooms:
 *           type: number
 *           description: Number of bathrooms
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             pincode:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                 lng:
 *                   type: number
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of amenities
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of features
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of image URLs
 *         externalLink:
 *           type: string
 *           format: uri
 *           description: URL to external property listing
 *         owner:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             contact:
 *               type: string
 *             email:
 *               type: string
 *         isActive:
 *           type: boolean
 *           description: Whether the property is active
 *         views:
 *           type: number
 *           description: Number of views
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['flat', 'villa', 'house', 'plot', 'commercial', 'pg']
  },
  status: {
    type: String,
    required: true,
    enum: ['sale', 'rent']
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: false
  },
  bathrooms: {
    type: Number,
    required: false
  },
  location: {
    address: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    pincode: {
      type: String,
      required: false
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [String],
  features: [String],
  images: [String],
  externalLink: {
    type: String,
    required: false
  },
  owner: {
    name: String,
    contact: String,
    email: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', PropertySchema);
