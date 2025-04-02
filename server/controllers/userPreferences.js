const UserPreference = require('../models/UserPreference');
const User = require('../models/User');

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
exports.getUserPreferences = async (req, res) => {
  try {
    let userPreference = await UserPreference.findOne({ user: req.user._id });

    if (!userPreference) {
      userPreference = await UserPreference.create({
        user: req.user._id,
        savedSearches: [],
        recentSearches: []
      });
    }

    res.status(200).json({
      success: true,
      data: userPreference
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add saved search
// @route   POST /api/users/preferences/saved-searches
// @access  Private
exports.addSavedSearch = async (req, res) => {
  try {
    const { location, propertyType, status, minPrice, maxPrice, bedrooms, notifyByEmail } = req.body;

    let userPreference = await UserPreference.findOne({ user: req.user._id });

    if (!userPreference) {
      userPreference = await UserPreference.create({
        user: req.user._id,
        savedSearches: [],
        recentSearches: []
      });
    }

    // Check if search already exists
    const searchExists = userPreference.savedSearches.some(
      search => 
        search.location === location &&
        search.propertyType === propertyType &&
        search.status === status
    );

    if (searchExists) {
      return res.status(400).json({
        success: false,
        message: 'Search already saved'
      });
    }

    userPreference.savedSearches.push({
      location,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      notifyByEmail
    });

    await userPreference.save();

    res.status(201).json({
      success: true,
      data: userPreference.savedSearches
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete saved search
// @route   DELETE /api/users/preferences/saved-searches/:id
// @access  Private
exports.deleteSavedSearch = async (req, res) => {
  try {
    const userPreference = await UserPreference.findOne({ user: req.user._id });

    if (!userPreference) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }

    // Remove saved search
    userPreference.savedSearches = userPreference.savedSearches.filter(
      search => search._id.toString() !== req.params.id
    );

    await userPreference.save();

    res.status(200).json({
      success: true,
      data: userPreference.savedSearches
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add recent search
// @route   POST /api/users/preferences/recent-searches
// @access  Private
exports.addRecentSearch = async (req, res) => {
  try {
    const { query, params } = req.body;

    let userPreference = await UserPreference.findOne({ user: req.user._id });

    if (!userPreference) {
      userPreference = await UserPreference.create({
        user: req.user._id,
        savedSearches: [],
        recentSearches: []
      });
    }

    // Add to recent searches (max 10)
    userPreference.recentSearches.unshift({
      query,
      params,
      timestamp: Date.now()
    });

    // Keep only the 10 most recent searches
    if (userPreference.recentSearches.length > 10) {
      userPreference.recentSearches = userPreference.recentSearches.slice(0, 10);
    }

    await userPreference.save();

    res.status(201).json({
      success: true,
      data: userPreference.recentSearches
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Clear recent searches
// @route   DELETE /api/users/preferences/recent-searches
// @access  Private
exports.clearRecentSearches = async (req, res) => {
  try {
    const userPreference = await UserPreference.findOne({ user: req.user._id });

    if (!userPreference) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }

    userPreference.recentSearches = [];
    await userPreference.save();

    res.status(200).json({
      success: true,
      message: 'Recent searches cleared'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    
    if (location) {
      user.location = location;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Deactivate account
// @route   PUT /api/users/deactivate
// @access  Private
exports.deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
