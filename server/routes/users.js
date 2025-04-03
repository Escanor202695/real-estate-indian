
const express = require('express');
const { 
  getUserPreferences, 
  addSavedSearch, 
  deleteSavedSearch,
  addRecentSearch,
  clearRecentSearches,
  updateUserProfile,
  changePassword,
  deactivateAccount
} = require('../controllers/userPreferences');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 */
router.put('/profile', updateUserProfile);

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Current password is incorrect
 */
router.put('/password', changePassword);

/**
 * @swagger
 * /api/users/deactivate:
 *   put:
 *     summary: Deactivate user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated successfully
 *       401:
 *         description: Not authorized
 */
router.put('/deactivate', deactivateAccount);

/**
 * @swagger
 * /api/users/preferences:
 *   get:
 *     summary: Get user preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/preferences', getUserPreferences);

/**
 * @swagger
 * /api/users/preferences/saved-searches:
 *   post:
 *     summary: Add a saved search
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               propertyType:
 *                 type: string
 *               status:
 *                 type: string
 *               minPrice:
 *                 type: number
 *               maxPrice:
 *                 type: number
 *               bedrooms:
 *                 type: number
 *               notifyByEmail:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Saved search added successfully
 *       400:
 *         description: Search already saved
 *       401:
 *         description: Not authorized
 */
router.post('/preferences/saved-searches', addSavedSearch);

/**
 * @swagger
 * /api/users/preferences/saved-searches/{id}:
 *   delete:
 *     summary: Delete a saved search
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Saved search ID
 *     responses:
 *       200:
 *         description: Saved search deleted successfully
 *       404:
 *         description: User preferences not found
 *       401:
 *         description: Not authorized
 */
router.delete('/preferences/saved-searches/:id', deleteSavedSearch);

/**
 * @swagger
 * /api/users/preferences/recent-searches:
 *   post:
 *     summary: Add a recent search
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               params:
 *                 type: object
 *     responses:
 *       201:
 *         description: Recent search added successfully
 *       401:
 *         description: Not authorized
 *   delete:
 *     summary: Clear all recent searches
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent searches cleared successfully
 *       404:
 *         description: User preferences not found
 *       401:
 *         description: Not authorized
 */
router.post('/preferences/recent-searches', addRecentSearch);
router.delete('/preferences/recent-searches', clearRecentSearches);

module.exports = router;
