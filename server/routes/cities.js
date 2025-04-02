
const express = require('express');
const { 
  getCities, 
  getCity, 
  createCity, 
  updateCity, 
  deleteCity,
  getCityProperties,
  getPopularCities
} = require('../controllers/cities');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/popular').get(getPopularCities);

router
  .route('/')
  .get(getCities)
  .post(protect, authorize('admin'), createCity);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateCity)
  .delete(protect, authorize('admin'), deleteCity);

router.route('/:name').get(getCity);
router.route('/:name/properties').get(getCityProperties);

module.exports = router;
