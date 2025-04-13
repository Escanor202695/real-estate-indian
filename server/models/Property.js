
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
 *         // External data fields
 *         external_id:
 *           type: string
 *           description: External property ID
 *         url:
 *           type: string
 *           description: Original listing URL
 *         name:
 *           type: string
 *           description: Property name/title from external source
 *         posted_date:
 *           type: string
 *           description: Date when property was posted
 *         price_per_sq_ft:
 *           type: number
 *           description: Price per square foot
 *         currency:
 *           type: string
 *           description: Currency symbol
 *         seo_description:
 *           type: string
 *           description: SEO optimized description
 *         landmark_details:
 *           type: array
 *           items:
 *             type: string
 *           description: Details about nearby landmarks
 *         landmark:
 *           type: string
 *           description: Primary landmark
 *         owner_name:
 *           type: string
 *           description: Name of the property owner
 *         company_name:
 *           type: string
 *           description: Name of the company/builder
 *         carpet_area:
 *           type: number
 *           description: Carpet area
 *         land_area_unit:
 *           type: string
 *           description: Unit for land area
 *         balconies:
 *           type: number
 *           description: Number of balconies
 *         facing:
 *           type: string
 *           description: Direction the property is facing
 *         floors:
 *           type: number
 *           description: Number of floors
 *         city_name:
 *           type: string
 *           description: Name of city
 *         address:
 *           type: string
 *           description: Complete address
 *         covered_area:
 *           type: number
 *           description: Covered area
 *         carp_area_unit:
 *           type: string
 *           description: Unit for carpet area
 *         cov_area_unit:
 *           type: string
 *           description: Unit for covered area
 *         operating_since:
 *           type: string
 *           description: When the property has been operating since
 *         image_url:
 *           type: string
 *           description: Main image URL
 *         from_url:
 *           type: string
 *           description: Source URL
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
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [String],
  features: [String],
  images: [String],
  externalLink: String,
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
  },
  
  // External data fields
  external_id: String,
  url: String,
  name: String,
  posted_date: String,
  price_per_sq_ft: Number,
  currency: String,
  seo_description: String,
  landmark_details: [String],
  landmark: String,
  owner_name: String,
  company_name: String,
  carpet_area: Number,
  land_area_unit: String,
  balconies: Number,
  facing: String,
  floors: Number,
  city_name: String,
  address: String,
  covered_area: Number,
  carp_area_unit: String,
  cov_area_unit: String,
  operating_since: String,
  image_url: String,
  from_url: String
});

module.exports = mongoose.model('Property', PropertySchema);
