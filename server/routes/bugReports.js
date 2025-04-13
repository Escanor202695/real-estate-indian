
const express = require('express');
const { 
  createBugReport,
  getBugReports,
  getBugReport,
  updateBugStatus,
  addBugNote,
  respondToBugReport
} = require('../controllers/bugReport');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for creating bug reports
router.post('/', createBugReport);

// Protected admin routes
router.get('/', protect, authorize('admin'), getBugReports);
router.get('/:id', protect, authorize('admin'), getBugReport);
router.put('/:id/status', protect, authorize('admin'), updateBugStatus);
router.post('/:id/notes', protect, authorize('admin'), addBugNote);
router.post('/:id/respond', protect, authorize('admin'), respondToBugReport);

module.exports = router;
