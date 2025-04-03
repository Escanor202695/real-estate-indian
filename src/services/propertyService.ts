
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
  // Send the array directly - the backend expects the array in the request body
  const response = await api.post('/properties/import', propertiesData);
  return response.data;
};
