
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
  console.log('Sending properties data:', propertiesData);
  
  // Make sure properties have all required fields before sending
  const validatedProperties = propertiesData.map(property => {
    // Ensure location object exists
    if (!property.location) {
      property.location = {
        address: property.location?.address || 'Unknown',
        city: property.location?.city || 'Unknown',
        state: property.location?.state || 'Unknown',
        pincode: property.location?.pincode || ''
      };
    }
    
    // Ensure all required fields have at least default values
    return {
      ...property,
      title: property.title || 'Untitled Property',
      description: property.description || 'No description provided',
      type: property.type || 'flat',
      status: property.status || 'sale',
      price: property.price || 0,
      size: property.size || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      externalLink: property.externalLink || '#',
      images: property.images || []
    };
  });
  
  const response = await api.post('/properties/import', validatedProperties);
  return response.data;
};
