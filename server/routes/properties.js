
const express = require('express');
const { 
  getProperties, 
  getProperty, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  getLatestProperties,
  getFeaturedProperties,
  importProperties
} = require('../controllers/properties');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/latest').get(getLatestProperties);
router.route('/featured').get(getFeaturedProperties);
router.route('/import').post(protect, authorize('admin'), importProperties);

router
  .route('/')
  .get(getProperties)
  .post(protect, authorize('admin'), createProperty);

router
  .route('/:id')
  .get(getProperty)
  .put(protect, authorize('admin'), updateProperty)
  .delete(protect, authorize('admin'), deleteProperty);

module.exports = router;
