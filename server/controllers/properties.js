
const Property = require('../models/Property');
const City = require('../models/City');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const filter = { isActive: true };
    const { location, type, status, minPrice, maxPrice, bedrooms } = req.query;
    
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
      
      // Increment search count for the city
      await City.findOneAndUpdate(
        { name: { $regex: location, $options: 'i' } },
        { $inc: { searchCount: 1 } }
      );
    }
    
    if (type && type !== 'all') filter.type = type;
    if (status && status !== 'all') filter.status = status;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    
    const properties = await Property.find(filter).select('-__v');
    
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

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Increment view count
    property.views += 1;
    await property.save();
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Admin)
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    
    // Increment property count for the city
    await City.findOneAndUpdate(
      { name: property.location.city },
      { $inc: { propertyCount: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin)
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Decrement property count for the city
    await City.findOneAndUpdate(
      { name: property.location.city },
      { $inc: { propertyCount: -1 } }
    );
    
    await property.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get latest properties
// @route   GET /api/properties/latest
// @access  Public
exports.getLatestProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(8);
    
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

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isActive: true })
      .sort({ views: -1 })
      .limit(6);
    
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

// @desc    Import properties from JSON
// @route   POST /api/properties/import
// @access  Private (Admin)
exports.importProperties = async (req, res) => {
  try {
    const properties = req.body;
    
    if (!Array.isArray(properties)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of properties'
      });
    }
    
    const insertedProperties = await Property.insertMany(properties);
    
    // Update city property counts
    for (const property of properties) {
      await City.findOneAndUpdate(
        { name: property.location.city },
        { $inc: { propertyCount: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    
    res.status(201).json({
      success: true,
      count: insertedProperties.length,
      message: 'Properties imported successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
