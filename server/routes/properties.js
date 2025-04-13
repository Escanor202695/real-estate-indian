const express = require('express');
const multer = require('multer');
const { 
  getProperties, 
  getProperty, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  getLatestProperties,
  getFeaturedProperties,
  importProperties,
  uploadPropertiesFile
} = require('../controllers/properties');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for JSON file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Accept only JSON files
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * @swagger
 * /api/properties/latest:
 *   get:
 *     summary: Get latest properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of latest properties
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
router.route('/latest').get(getLatestProperties);

/**
 * @swagger
 * /api/properties/featured:
 *   get:
 *     summary: Get featured properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of featured properties
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
router.route('/featured').get(getFeaturedProperties);

/**
 * @swagger
 * /api/properties/upload:
 *   post:
 *     summary: Upload and import properties from JSON file
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Properties imported successfully
 *       401:
 *         description: Not authorized
 *       400:
 *         description: Invalid data
 */
router.route('/upload').post(protect, authorize('admin'), upload.single('file'), uploadPropertiesFile);

/**
 * @swagger
 * /api/properties/import:
 *   post:
 *     summary: Import multiple properties from JSON data
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Properties imported successfully
 *       401:
 *         description: Not authorized
 *       400:
 *         description: Invalid data
 */
router.route('/import').post(protect, authorize('admin'), importProperties);

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties with optional filters
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (city, address)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [flat, villa, house, plot, commercial, pg, all]
 *         description: Filter by property type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [sale, rent, all]
 *         description: Filter by property status
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: Minimum number of bedrooms
 *     responses:
 *       200:
 *         description: List of properties
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
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Property created successfully
 *       401:
 *         description: Not authorized
 *       400:
 *         description: Invalid data
 */
router
  .route('/')
  .get(getProperties)
  .post(protect, authorize('admin'), createProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 *       401:
 *         description: Not authorized
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 *       401:
 *         description: Not authorized
 */
router
  .route('/:id')
  .get(getProperty)
  .put(protect, authorize('admin'), updateProperty)
  .delete(protect, authorize('admin'), deleteProperty);

module.exports = router;
