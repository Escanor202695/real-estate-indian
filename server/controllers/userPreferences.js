
const UserPreference = require('../models/UserPreference');
const User = require('../models/User');
const Property = require('../models/Property');
const nodemailer = require('nodemailer');

// Helper function to send email notifications
const sendEmail = async (to, subject, htmlContent) => {
  // Create reusable transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM || 'ClickProp Real Estate'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: htmlContent
  });

  return info;
};

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
        search.status === status &&
        search.minPrice === minPrice &&
        search.maxPrice === maxPrice &&
        search.bedrooms === bedrooms
    );

    if (searchExists) {
      return res.status(400).json({
        success: false,
        message: 'Search already saved'
      });
    }

    const newSearch = {
      location,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      notifyByEmail: notifyByEmail === undefined ? true : notifyByEmail,
      createdAt: new Date()
    };

    userPreference.savedSearches.push(newSearch);
    await userPreference.save();

    res.status(201).json({
      success: true,
      data: newSearch
    });
  } catch (err) {
    console.error('Error saving search:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
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
    console.error('Error adding recent search:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
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

// @desc    Process property alerts for all users
// @route   POST /api/users/process-alerts
// @access  Admin/Cron
exports.processPropertyAlerts = async (req, res) => {
  try {
    // Get all user preferences with active email notifications
    const userPreferences = await UserPreference.find({
      'savedSearches.notifyByEmail': true
    }).populate('user');
    
    let alertsProcessed = 0;
    let emailsSent = 0;
    
    // Process each user's saved searches
    for (const preference of userPreferences) {
      const user = preference.user;
      
      if (!user || !user.isActive) {
        continue;
      }
      
      // Process each saved search with notifications enabled
      for (const search of preference.savedSearches.filter(s => s.notifyByEmail)) {
        alertsProcessed++;
        
        // Build query to find matching properties
        const query = {};
        
        // Only include properties created in the last day
        query.createdAt = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
        
        if (search.location) {
          query['location.city'] = { $regex: new RegExp(search.location, 'i') };
        }
        
        if (search.propertyType && search.propertyType !== 'all') {
          query.type = search.propertyType;
        }
        
        if (search.status && search.status !== 'all') {
          query.status = search.status;
        }
        
        if (search.minPrice) {
          query.price = query.price || {};
          query.price.$gte = search.minPrice;
        }
        
        if (search.maxPrice) {
          query.price = query.price || {};
          query.price.$lte = search.maxPrice;
        }
        
        if (search.bedrooms) {
          query.bedrooms = { $gte: search.bedrooms };
        }
        
        // Find matching properties
        const matchingProperties = await Property.find(query).limit(10);
        
        // If matching properties found, send email notification
        if (matchingProperties.length > 0) {
          try {
            // Prepare email content
            let propertiesHtml = '';
            
            matchingProperties.forEach(property => {
              const imageUrl = property.images && property.images.length > 0 ? 
                property.images[0] : 
                `${process.env.FRONTEND_URL}/placeholder.svg`;
              
              propertiesHtml += `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e1e1e1;">
                  <div style="display: flex; flex-direction: row;">
                    <div style="flex: 0 0 100px; margin-right: 15px;">
                      <img src="${imageUrl}" alt="${property.title}" style="width: 100px; height: 80px; object-fit: cover; border-radius: 4px;">
                    </div>
                    <div style="flex: 1;">
                      <h3 style="margin: 0 0 5px 0; font-size: 16px;">${property.title}</h3>
                      <p style="margin: 0 0 5px 0; font-size: 14px;">${property.location.address}, ${property.location.city}</p>
                      <p style="margin: 0 0 5px 0; font-size: 14px;">${property.bedrooms} bed | ${property.bathrooms} bath | ${property.size} sq ft</p>
                      <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">₹${property.price.toLocaleString()}</p>
                      <a href="${process.env.FRONTEND_URL}/property/${property._id}" 
                         style="color: #2563eb; text-decoration: none; font-size: 14px;">
                        View Property
                      </a>
                    </div>
                  </div>
                </div>
              `;
            });
            
            // Generate search filters text
            let filtersText = [];
            if (search.location) filtersText.push(`Location: ${search.location}`);
            if (search.propertyType && search.propertyType !== 'all') filtersText.push(`Type: ${search.propertyType}`);
            if (search.status && search.status !== 'all') filtersText.push(`For: ${search.status === 'sale' ? 'Sale' : 'Rent'}`);
            if (search.bedrooms) filtersText.push(`${search.bedrooms}+ bedrooms`);
            if (search.minPrice) filtersText.push(`Min price: ₹${search.minPrice.toLocaleString()}`);
            if (search.maxPrice) filtersText.push(`Max price: ₹${search.maxPrice.toLocaleString()}`);
            
            // Create search params for link
            const searchParams = new URLSearchParams();
            if (search.location) searchParams.append('location', search.location);
            if (search.propertyType && search.propertyType !== 'all') searchParams.append('type', search.propertyType);
            if (search.status && search.status !== 'all') searchParams.append('status', search.status);
            if (search.minPrice) searchParams.append('minPrice', search.minPrice.toString());
            if (search.maxPrice) searchParams.append('maxPrice', search.maxPrice.toString());
            if (search.bedrooms) searchParams.append('bedrooms', search.bedrooms.toString());
            
            await sendEmail(
              user.email,
              `New Properties Found: ${matchingProperties.length} listings match your search`,
              `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                <h2 style="color: #2563eb;">New Properties Found!</h2>
                <p>Hello ${user.name},</p>
                <p>We've found ${matchingProperties.length} new properties matching your saved search:</p>
                <p style="padding: 8px 12px; background-color: #f3f4f6; border-radius: 4px; font-size: 14px;">
                  ${filtersText.join(' | ')}
                </p>
                
                <div style="margin-top: 20px;">
                  ${propertiesHtml}
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                  <a href="${process.env.FRONTEND_URL}/properties?${searchParams.toString()}" 
                     style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View All Matching Properties
                  </a>
                </div>
                
                <p style="margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center;">
                  You are receiving this email because you set up a property alert on ClickProp.
                  <br>
                  To manage your alerts, visit your <a href="${process.env.FRONTEND_URL}/dashboard/property-alerts" style="color: #2563eb;">account settings</a>.
                </p>
              </div>
              `
            );
            
            emailsSent++;
            
            // Create notification in user preferences
            preference.notifications.push({
              message: `We found ${matchingProperties.length} new properties matching your saved search for ${search.location || 'properties'}`,
              read: false,
              createdAt: new Date()
            });
            
            await preference.save();
          } catch (err) {
            console.error(`Error sending alert email to ${user.email}:`, err);
          }
        }
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        alertsProcessed,
        emailsSent
      }
    });
  } catch (err) {
    console.error('Error processing property alerts:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
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
