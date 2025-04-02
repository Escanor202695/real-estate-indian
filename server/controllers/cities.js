
const City = require('../models/City');
const Property = require('../models/Property');

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).select('-__v');
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single city
// @route   GET /api/cities/:name
// @access  Public
exports.getCity = async (req, res) => {
  try {
    const city = await City.findOne({ 
      name: { $regex: new RegExp('^' + req.params.name + '$', 'i') },
      isActive: true 
    });
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    // Increment search count
    city.searchCount += 1;
    await city.save();
    
    res.status(200).json({
      success: true,
      data: city
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get properties by city
// @route   GET /api/cities/:name/properties
// @access  Public
exports.getCityProperties = async (req, res) => {
  try {
    const properties = await Property.find({ 
      'location.city': { $regex: new RegExp('^' + req.params.name + '$', 'i') },
      isActive: true 
    });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create city
// @route   POST /api/cities
// @access  Private (Admin)
exports.createCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    
    res.status(201).json({
      success: true,
      data: city
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update city
// @route   PUT /api/cities/:id
// @access  Private (Admin)
exports.updateCity = async (req, res) => {
  try {
    let city = await City.findById(req.params.id);
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: city
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete city
// @route   DELETE /api/cities/:id
// @access  Private (Admin)
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    await city.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'City deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get popular cities
// @route   GET /api/cities/popular
// @access  Public
exports.getPopularCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true })
      .sort({ searchCount: -1 })
      .limit(4);
    
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
