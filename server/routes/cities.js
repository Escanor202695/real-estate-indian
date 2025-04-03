
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

/**
 * @swagger
 * /api/cities/popular:
 *   get:
 *     summary: Get popular cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: List of popular cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 */
router.route('/popular').get(getPopularCities);

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Get all cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: List of all cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: City created successfully
 *       401:
 *         description: Not authorized
 *       400:
 *         description: Invalid data
 */
router
  .route('/')
  .get(getCities)
  .post(protect, authorize('admin'), createCity);

/**
 * @swagger
 * /api/cities/{id}:
 *   put:
 *     summary: Update a city
 *     tags: [Cities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: City ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: City updated successfully
 *       404:
 *         description: City not found
 *       401:
 *         description: Not authorized
 *   delete:
 *     summary: Delete a city
 *     tags: [Cities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: City ID
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       404:
 *         description: City not found
 *       401:
 *         description: Not authorized
 */
router
  .route('/:id')
  .put(protect, authorize('admin'), updateCity)
  .delete(protect, authorize('admin'), deleteCity);

/**
 * @swagger
 * /api/cities/{name}:
 *   get:
 *     summary: Get a city by name
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: City name
 *     responses:
 *       200:
 *         description: City details
 *       404:
 *         description: City not found
 */
router.route('/:name').get(getCity);

/**
 * @swagger
 * /api/cities/{name}/properties:
 *   get:
 *     summary: Get properties in a city
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: City name
 *     responses:
 *       200:
 *         description: List of properties in the city
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 */
router.route('/:name/properties').get(getCityProperties);

module.exports = router;
