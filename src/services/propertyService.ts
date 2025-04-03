
import api from './api';
import { Property } from '@/types/property';

export const getProperties = async (params?: any) => {
  const response = await api.get('/properties', { params });
  return response.data;
};

export const getProperty = async (id: string) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const getLatestProperties = async () => {
  const response = await api.get('/properties/latest');
  return response.data;
};

export const getFeaturedProperties = async () => {
  const response = await api.get('/properties/featured');
  return response.data;
};

export const createProperty = async (propertyData: Partial<Property>) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

export const updateProperty = async (id: string, propertyData: Partial<Property>) => {
  const response = await api.put(`/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id: string) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};

export const importProperties = async (propertiesData: Partial<Property>[]) => {
  // Debug log to see what's being sent
  console.log('Importing properties data. Count:', propertiesData.length);
  
  // Transform the imported JSON format to match our database schema
  const transformedProperties = propertiesData.map(property => {
    // Extract coordinates from location string if present
    let coordinates = undefined;
    if (property.location && typeof property.location === 'string' && property.location.includes(',')) {
      const [lat, lng] = property.location.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        coordinates = { lat, lng };
      }
    }
    
    // Build a properly formatted property object
    return {
      title: property.name || property.title || 'Untitled Property',
      description: property.description || property.seo_description || 'No description provided',
      type: mapPropertyType(property),
      status: 'sale', // Assuming all imported properties are for sale
      price: property.price || 0,
      size: property.covered_area || property.size || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      location: {
        address: property.address || 'Unknown',
        city: property.city_name || (typeof property.location === 'object' ? property.location.city : 'Unknown'),
        state: typeof property.location === 'object' ? property.location.state : 'Unknown',
        pincode: typeof property.location === 'object' ? property.location.pincode : '',
        coordinates: coordinates
      },
      amenities: property.amenities || [],
      features: property.landmark_details || [],
      images: property.image_url ? [property.image_url] : (property.images || []),
      externalLink: property.url || property.from_url || property.externalLink || '#',
      owner: property.owner_name ? {
        name: property.owner_name,
        contact: '',
        email: ''
      } : undefined,
      isActive: true,
      views: 0,
      createdAt: property.posted_date ? new Date(property.posted_date) : new Date()
    };
  });
  
  console.log('Transformed properties example:', transformedProperties[0]);
  
  const response = await api.post('/properties/import', transformedProperties);
  return response.data;
};

// Helper function to map property type from imported data
function mapPropertyType(property: any): string {
  const title = (property.name || property.title || '').toLowerCase();
  
  if (title.includes('apartment') || title.includes('flat')) {
    return 'flat';
  } else if (title.includes('villa')) {
    return 'villa';
  } else if (title.includes('house')) {
    return 'house';
  } else if (title.includes('plot') || title.includes('land')) {
    return 'plot';
  } else if (title.includes('commercial') || title.includes('office') || title.includes('shop')) {
    return 'commercial';
  } else if (title.includes('pg') || title.includes('hostel')) {
    return 'pg';
  }
  
  return 'flat'; // Default to flat if no match found
}
