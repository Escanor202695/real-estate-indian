
const express = require('express');
const { 
  getAdminStats, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser,
  notifyUsers
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes and authorize admin only
router.use(protect, authorize('admin'));

// Admin dashboard routes
router.get('/stats', getAdminStats);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Notification routes
router.post('/notify-users', notifyUsers);

module.exports = router;
