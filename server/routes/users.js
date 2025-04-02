
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

// User profile routes
router.put('/profile', updateUserProfile);
router.put('/password', changePassword);
router.put('/deactivate', deactivateAccount);

// User preferences routes
router.get('/preferences', getUserPreferences);
router.post('/preferences/saved-searches', addSavedSearch);
router.delete('/preferences/saved-searches/:id', deleteSavedSearch);
router.post('/preferences/recent-searches', addRecentSearch);
router.delete('/preferences/recent-searches', clearRecentSearches);

module.exports = router;
