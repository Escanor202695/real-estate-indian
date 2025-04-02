
import api from './api';
import { City } from '@/types/city';

export const getCities = async () => {
  const response = await api.get('/cities');
  return response.data;
};

export const getCity = async (name: string) => {
  const response = await api.get(`/cities/${name}`);
  return response.data;
};

export const getCityProperties = async (name: string) => {
  const response = await api.get(`/cities/${name}/properties`);
  return response.data;
};

export const getPopularCities = async () => {
  const response = await api.get('/cities/popular');
  return response.data;
};

export const createCity = async (cityData: Partial<City>) => {
  const response = await api.post('/cities', cityData);
  return response.data;
};

export const updateCity = async (id: string, cityData: Partial<City>) => {
  const response = await api.put(`/cities/${id}`, cityData);
  return response.data;
};

export const deleteCity = async (id: string) => {
  const response = await api.delete(`/cities/${id}`);
  return response.data;
};
