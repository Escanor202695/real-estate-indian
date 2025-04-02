
const Property = require('../models/Property');
const User = require('../models/User');
const City = require('../models/City');
const UserPreference = require('../models/UserPreference');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalCities = await City.countDocuments();
    
    // Get property stats by type
    const propertyTypeStats = await Property.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Get property stats by status
    const propertyStatusStats = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get top cities by property count
    const topCities = await City.find()
      .sort({ propertyCount: -1 })
      .limit(5);
    
    // Get top cities by search count
    const topSearchedCities = await City.find()
      .sort({ searchCount: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        propertyStats: {
          total: totalProperties,
          active: activeProperties,
          byType: propertyTypeStats,
          byStatus: propertyStatusStats
        },
        userStats: {
          total: totalUsers,
          active: activeUsers
        },
        cityStats: {
          total: totalCities,
          topByPropertyCount: topCities,
          topBySearchCount: topSearchedCities
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user preferences
    const userPreference = await UserPreference.findOne({ user: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {
        user,
        preferences: userPreference || null
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete user preferences
    await UserPreference.findOneAndDelete({ user: req.params.id });
    
    // Delete user
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Notify users about new properties
// @route   POST /api/admin/notify-users
// @access  Private (Admin)
exports.notifyUsers = async (req, res) => {
  try {
    const { propertyIds } = req.body;
    
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Property IDs are required'
      });
    }
    
    // Get properties
    const properties = await Property.find({ _id: { $in: propertyIds } });
    
    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No properties found'
      });
    }
    
    // Find users with matching saved searches
    const userPreferences = await UserPreference.find({
      'savedSearches.notifyByEmail': true
    });
    
    const notifiedUsers = [];
    
    // For each user preference, check if any property matches saved searches
    for (const userPref of userPreferences) {
      let userNotified = false;
      
      // For each saved search, check if any property matches
      for (const savedSearch of userPref.savedSearches) {
        if (!savedSearch.notifyByEmail) continue;
        
        // Find matching properties
        const matchingProperties = properties.filter(property => {
          const locationMatch = !savedSearch.location || 
            property.location.city.toLowerCase().includes(savedSearch.location.toLowerCase()) || 
            property.location.address.toLowerCase().includes(savedSearch.location.toLowerCase());
          
          const typeMatch = !savedSearch.propertyType || savedSearch.propertyType === 'all' || 
            property.type === savedSearch.propertyType;
          
          const statusMatch = !savedSearch.status || savedSearch.status === 'all' || 
            property.status === savedSearch.status;
          
          const priceMatch = (!savedSearch.minPrice || property.price >= savedSearch.minPrice) && 
            (!savedSearch.maxPrice || property.price <= savedSearch.maxPrice);
          
          const bedroomsMatch = !savedSearch.bedrooms || property.bedrooms >= savedSearch.bedrooms;
          
          return locationMatch && typeMatch && statusMatch && priceMatch && bedroomsMatch;
        });
        
        if (matchingProperties.length > 0) {
          // Add notification for user
          userPref.notifications.unshift({
            message: `We found ${matchingProperties.length} new properties matching your saved search for ${savedSearch.location || 'any location'}.`,
            read: false,
            createdAt: Date.now()
          });
          
          userNotified = true;
        }
      }
      
      if (userNotified) {
        await userPref.save();
        notifiedUsers.push(userPref.user);
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Notified ${notifiedUsers.length} users about new properties`,
      data: {
        notifiedUsers,
        properties
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
