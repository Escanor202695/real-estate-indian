
import api from './api';
import { Property } from '@/types/property';

export const getProperties = async (params?: any) => {
  try {
    const response = await api.get('/properties', { params });
    return response.data;
  } catch (error) {
    console.log('Using dummy properties instead of API call');
    return {
      success: true,
      data: generateDummyProperties(10, params),
      pagination: {
        total: 100,
        page: params?.page || 1,
        pages: 10,
        limit: 10
      }
    };
  }
};

export const getProperty = async (id: string) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using dummy property instead of API call');
    return {
      success: true,
      data: generateDummyProperty(id)
    };
  }
};

export const getLatestProperties = async () => {
  try {
    const response = await api.get('/properties/latest');
    return response.data;
  } catch (error) {
    console.log('Using dummy latest properties instead of API call');
    return {
      success: true,
      data: generateDummyProperties(6)
    };
  }
};

export const getFeaturedProperties = async () => {
  try {
    const response = await api.get('/properties/featured');
    return response.data;
  } catch (error) {
    console.log('Using dummy featured properties instead of API call');
    return {
      success: true,
      data: generateDummyProperties(6, { featured: true })
    };
  }
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
  const response = await api.post('/properties/import', { properties: propertiesData });
  return response.data;
};

// Helper function to generate dummy properties
const generateDummyProperties = (count: number, filters?: any) => {
  const properties = [];
  const types = ['apartment', 'house', 'condo', 'villa', 'commercial'];
  const cities = ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Miami'];
  const statuses = ['sale', 'rent'];
  
  for (let i = 0; i < count; i++) {
    properties.push(generateDummyProperty(`dummy-property-${i}`));
  }
  
  return properties;
};

// Helper function to generate a single dummy property
const generateDummyProperty = (id: string) => {
  const types = ['apartment', 'house', 'condo', 'villa', 'commercial'];
  const cities = ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Miami'];
  const statuses = ['sale', 'rent'];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const price = status === 'sale' ? 
    Math.floor(Math.random() * 1000000) + 200000 : 
    Math.floor(Math.random() * 3000) + 1500;
  
  return {
    _id: id,
    title: `Beautiful ${type} in ${city}`,
    description: `This is a fantastic ${type} located in ${city} with amazing views and amenities.`,
    price,
    status,
    type,
    bedrooms: Math.floor(Math.random() * 5) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    area: Math.floor(Math.random() * 2000) + 500,
    featured: Math.random() > 0.7,
    location: {
      address: `${Math.floor(Math.random() * 999) + 1} Main St`,
      city,
      state: 'CA',
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: 'USA',
      coordinates: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.1,
        lng: -122.4194 + (Math.random() - 0.5) * 0.1
      }
    },
    features: [
      'Air Conditioning',
      'Balcony',
      'Gym',
      'Swimming Pool',
      'Parking',
      'Security'
    ].slice(0, Math.floor(Math.random() * 6) + 1),
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  };
};
