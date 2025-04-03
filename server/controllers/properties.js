const Property = require('../models/Property');
const City = require('../models/City');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const filter = { isActive: true };
    const { location, type, status, minPrice, maxPrice, bedrooms, page, limit } = req.query;
    
    // Build filter object
    if (location) {
      // Use regex for partial matches on city, address, or project name
      filter['$or'] = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } },
        { 'title': { $regex: location, $options: 'i' } }
      ];
      
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
    
    // Pagination logic
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination
    const totalCount = await Property.countDocuments(filter);
    
    // Get paginated properties
    const properties = await Property.find(filter)
      .select('-__v')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: totalCount,
      data: properties,
      page: pageNum,
      pages: Math.ceil(totalCount / limitNum)
    });
  } catch (err) {
    console.error('Error fetching properties:', err);
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
    // Log what we're receiving to debug
    console.log('Import properties request body type:', typeof req.body);
    console.log('Is array:', Array.isArray(req.body));
    console.log('Number of properties:', Array.isArray(req.body) ? req.body.length : 'Not an array');
    
    // Ensure we have an array of properties
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of properties'
      });
    }
    
    const properties = req.body;
    
    if (properties.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Empty properties array provided'
      });
    }
    
    // Log a sample property for debugging
    if (properties.length > 0) {
      console.log('Sample property received:', JSON.stringify(properties[0], null, 2));
    }
    
    // Validate required fields for each property
    const validProperties = properties.filter(property => {
      if (!property.title || 
          !property.type || 
          !property.status || 
          !property.location || 
          typeof property.price !== 'number') {
        console.log('Invalid property:', property.title || 'unnamed');
        return false;
      }
      
      // Make sure location has the required fields (except pincode which is now optional)
      if (!property.location.address || 
          !property.location.city || 
          !property.location.state) {
        console.log('Invalid location:', property.location);
        return false;
      }
      
      return true;
    });
    
    console.log(`${validProperties.length} out of ${properties.length} properties are valid`);
    
    if (validProperties.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'None of the properties have all required fields'
      });
    }
    
    // Insert properties into the database
    const insertedProperties = await Property.insertMany(validProperties);
    console.log(`Successfully inserted ${insertedProperties.length} properties`);
    
    // Update city property counts
    for (const property of insertedProperties) {
      if (property.location && property.location.city) {
        await City.findOneAndUpdate(
          { name: property.location.city },
          { $inc: { propertyCount: 1 } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }
    
    res.status(201).json({
      success: true,
      count: insertedProperties.length,
      message: `${insertedProperties.length} properties imported successfully`
    });
  } catch (err) {
    console.error('Error importing properties:', err);
    
    // Provide more detailed error information
    let errorMessage = 'Server Error';
    if (err.name === 'ValidationError') {
      errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
    } else if (err.code === 11000) {
      errorMessage = 'Duplicate key error. Some properties may already exist in the database.';
    } else {
      errorMessage = err.message;
    }
    
    res.status(400).json({
      success: false,
      message: errorMessage
    });
  }
};
