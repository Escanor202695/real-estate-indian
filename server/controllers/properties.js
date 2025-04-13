
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

// @desc    Upload and process properties from a JSON file
// @route   POST /api/properties/upload
// @access  Private (Admin)
exports.uploadPropertiesFile = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a JSON file'
      });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);

    // Parse the JSON file content
    let properties = [];
    try {
      properties = JSON.parse(req.file.buffer.toString());
      console.log(`Parsed ${properties.length} properties from file`);
      
      // Handle both array and single object formats
      if (!Array.isArray(properties)) {
        if (typeof properties === 'object') {
          properties = [properties]; // Convert single object to array
          console.log('Converted single object to array');
        } else {
          throw new Error('Invalid JSON format: must be an object or array');
        }
      }
    } catch (err) {
      console.error('JSON parsing error:', err);
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format. Please check your file.'
      });
    }

    if (properties.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No properties found in the file'
      });
    }

    // Log a sample property
    console.log('Sample property from file:', JSON.stringify(properties[0], null, 2));
    
    // Map external format to our schema format
    const mappedProperties = properties.map(prop => {
      // Extract type from property name or use default
      let type = 'flat'; // default
      if (prop.name) {
        const lowerName = prop.name.toLowerCase();
        if (lowerName.includes('villa')) type = 'villa';
        else if (lowerName.includes('house')) type = 'house';
        else if (lowerName.includes('plot')) type = 'plot';
        else if (lowerName.includes('commercial')) type = 'commercial';
        else if (lowerName.includes('pg')) type = 'pg';
        else if (lowerName.includes('apartment') || lowerName.includes('flat')) type = 'flat';
      }
      
      // Determine status (sale/rent) from property name or URL
      let status = 'sale'; // default
      if ((prop.name && prop.name.toLowerCase().includes('rent')) || 
          (prop.url && prop.url.toLowerCase().includes('rent'))) {
        status = 'rent';
      }
      
      return {
        title: prop.name || prop.title || 'Untitled Property',
        description: prop.description || prop.seo_description || 'No description available',
        type: type,
        status: status,
        price: prop.price || 0,
        size: prop.covered_area || prop.size || 0,
        bedrooms: prop.bedrooms || null,
        bathrooms: prop.bathrooms || null,
        location: {
          address: prop.address || null,
          city: prop.city_name || null,
          coordinates: prop.location ? {
            lat: parseFloat(prop.location.split(',')[0]) || null,
            lng: parseFloat(prop.location.split(',')[1]) || null
          } : null
        },
        amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
        images: prop.image_url ? [prop.image_url] : [],
        external_id: prop.id || null,
        url: prop.url || null,
        name: prop.name || null,
        posted_date: prop.posted_date || null,
        price_per_sq_ft: prop.price_per_sq_ft || null,
        currency: prop.currency || null,
        seo_description: prop.seo_description || null,
        landmark_details: prop.landmark_details || [],
        landmark: prop.landmark || null,
        owner_name: prop.owner_name || null,
        company_name: prop.company_name || null,
        carpet_area: prop.carpet_area || null,
        land_area_unit: prop.land_area_unit || null,
        balconies: prop.balconies || null,
        facing: prop.facing || null,
        floors: prop.floors || null,
        city_name: prop.city_name || null,
        covered_area: prop.covered_area || null,
        carp_area_unit: prop.carp_area_unit || null,
        cov_area_unit: prop.cov_area_unit || null,
        operating_since: prop.operating_since || null,
        image_url: prop.image_url || null,
        from_url: prop.from_url || null
      };
    });
    
    console.log(`Mapped ${mappedProperties.length} properties`);
    
    // Filter valid properties (only required fields: title, description, type, status, price, size)
    const validProperties = mappedProperties.filter(property => {
      const hasRequiredFields = 
        property.title && 
        typeof property.title === 'string' &&
        property.description && 
        typeof property.description === 'string' &&
        property.type && 
        typeof property.type === 'string' &&
        property.status && 
        typeof property.status === 'string' &&
        property.price !== undefined && 
        !isNaN(Number(property.price)) &&
        property.size !== undefined && 
        !isNaN(Number(property.size));
      
      if (!hasRequiredFields) {
        console.log('Invalid property:', property.title || 'unnamed', 'Missing required fields');
      }
      
      return hasRequiredFields;
    });

    console.log(`Found ${validProperties.length} valid properties out of ${mappedProperties.length}`);

    if (validProperties.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid properties found in the file. Each property must have title, description, type, status, price, and size fields.'
      });
    }

    // Insert valid properties into the database
    try {
      const insertedProperties = await Property.insertMany(validProperties);
      console.log(`Successfully inserted ${insertedProperties.length} properties`);
      
      // Update city property counts if city is provided
      for (const property of insertedProperties) {
        if (property.location && property.location.city) {
          await City.findOneAndUpdate(
            { name: property.location.city },
            { $inc: { propertyCount: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } else if (property.city_name) {
          await City.findOneAndUpdate(
            { name: property.city_name },
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
      console.error('Database error:', err);
      
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
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      success: false,
      message: `Error processing file: ${err.message}`
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
    
    // Map external format to our schema format - similar to uploadPropertiesFile
    const mappedProperties = properties.map(prop => {
      // Extract type from property name or use default
      let type = 'flat'; // default
      if (prop.name) {
        const lowerName = prop.name.toLowerCase();
        if (lowerName.includes('villa')) type = 'villa';
        else if (lowerName.includes('house')) type = 'house';
        else if (lowerName.includes('plot')) type = 'plot';
        else if (lowerName.includes('commercial')) type = 'commercial';
        else if (lowerName.includes('pg')) type = 'pg';
        else if (lowerName.includes('apartment') || lowerName.includes('flat')) type = 'flat';
      }
      
      // Determine status (sale/rent) from property name or URL
      let status = 'sale'; // default
      if ((prop.name && prop.name.toLowerCase().includes('rent')) || 
          (prop.url && prop.url.toLowerCase().includes('rent'))) {
        status = 'rent';
      }
      
      return {
        title: prop.name || prop.title || 'Untitled Property',
        description: prop.description || prop.seo_description || 'No description available',
        type: type,
        status: status,
        price: prop.price || 0,
        size: prop.covered_area || prop.size || 0,
        bedrooms: prop.bedrooms || null,
        bathrooms: prop.bathrooms || null,
        location: {
          address: prop.address || null,
          city: prop.city_name || null,
          coordinates: prop.location ? {
            lat: parseFloat(prop.location.split(',')[0]) || null,
            lng: parseFloat(prop.location.split(',')[1]) || null
          } : null
        },
        amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
        images: prop.image_url ? [prop.image_url] : [],
        external_id: prop.id || null,
        url: prop.url || null,
        name: prop.name || null,
        posted_date: prop.posted_date || null,
        price_per_sq_ft: prop.price_per_sq_ft || null,
        currency: prop.currency || null,
        seo_description: prop.seo_description || null,
        landmark_details: prop.landmark_details || [],
        landmark: prop.landmark || null,
        owner_name: prop.owner_name || null,
        company_name: prop.company_name || null,
        carpet_area: prop.carpet_area || null,
        land_area_unit: prop.land_area_unit || null,
        balconies: prop.balconies || null,
        facing: prop.facing || null,
        floors: prop.floors || null,
        city_name: prop.city_name || null,
        covered_area: prop.covered_area || null,
        carp_area_unit: prop.carp_area_unit || null,
        cov_area_unit: prop.cov_area_unit || null,
        operating_since: prop.operating_since || null,
        image_url: prop.image_url || null,
        from_url: prop.from_url || null
      };
    });
    
    console.log(`Mapped ${mappedProperties.length} properties`);
    
    // Validate required fields for each property
    const validProperties = mappedProperties.filter(property => {
      if (!property.title || 
          !property.description ||
          !property.type || 
          !property.status || 
          typeof property.price !== 'number' ||
          typeof property.size !== 'number') {
        console.log('Invalid property:', property.title || 'unnamed');
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
    
    // Update city property counts if city is provided
    for (const property of insertedProperties) {
      if (property.location && property.location.city) {
        await City.findOneAndUpdate(
          { name: property.location.city },
          { $inc: { propertyCount: 1 } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } else if (property.city_name) {
        await City.findOneAndUpdate(
          { name: property.city_name },
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
