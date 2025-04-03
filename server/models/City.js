
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       required:
 *         - name
 *         - state
 *       properties:
 *         _id:
 *           type: string
 *           description: City ID
 *         name:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State where the city is located
 *         propertyCount:
 *           type: number
 *           description: Number of properties in this city
 *         searchCount:
 *           type: number
 *           description: Number of times this city has been searched
 *         isActive:
 *           type: boolean
 *           description: Whether the city is active in the system
 *         image:
 *           type: string
 *           description: URL to city image
 */
const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  state: {
    type: String,
    required: true
  },
  propertyCount: {
    type: Number,
    default: 0
  },
  searchCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('City', CitySchema);
