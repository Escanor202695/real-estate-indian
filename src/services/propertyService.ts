import api from './api';

// Property listings
export const getProperties = async (params?: any) => {
  const response = await api.get('/properties', { params });
  return response.data;
};

export const getProperty = async (id: string) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const getPropertiesForAgent = async (agentId: string) => {
  const response = await api.get(`/properties/agent/${agentId}`);
  return response.data;
};

export const getFeaturedProperties = async () => {
  const response = await api.get('/properties/featured');
  return response.data;
};

export const getLatestProperties = async (limit: number = 8) => {
  const response = await api.get('/properties/latest', { params: { limit } });
  return response.data;
};

export const getPropertyBySlug = async (slug: string) => {
  const response = await api.get(`/properties/slug/${slug}`);
  return response.data;
};

// Property CRUD operations
export const createProperty = async (propertyData: any) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

export const updateProperty = async (id: string, propertyData: any) => {
  const response = await api.put(`/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id: string) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};

// Property actions
export const toggleFavoriteProperty = async (propertyId: string) => {
  const response = await api.post(`/properties/${propertyId}/favorite`);
  return response.data;
};

export const reportProperty = async (propertyId: string, reason: string) => {
  const response = await api.post(`/properties/${propertyId}/report`, { reason });
  return response.data;
};

export const searchProperties = async (filters: any) => {
  // Handle special case for amenities which might be a string or array
  if (filters.amenities && typeof filters.amenities === 'string') {
    filters.amenities = filters.amenities.split(',');
  }
  
  const response = await api.get('/properties/search', { params: filters });
  return response.data;
};

export const incrementPropertyViews = async (propertyId: string) => {
  const response = await api.post(`/properties/${propertyId}/view`);
  return response.data;
};

// Update the importProperties function to better handle errors
export const importProperties = async (propertiesData: any[]) => {
  try {
    console.log(`Sending ${propertiesData.length} properties to server`);
    const response = await api.post('/properties/import', propertiesData);
    console.log('Import API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Import API error:', error);
    throw error;
  }
};
