
import api from './api';

export const getUserPreferences = async () => {
  const response = await api.get('/users/preferences');
  return response.data;
};

export const addSavedSearch = async (searchData: any) => {
  const response = await api.post('/users/preferences/saved-searches', searchData);
  return response.data;
};

export const deleteSavedSearch = async (id: string) => {
  const response = await api.delete(`/users/preferences/saved-searches/${id}`);
  return response.data;
};

export const addRecentSearch = async (searchData: any) => {
  const response = await api.post('/users/preferences/recent-searches', searchData);
  return response.data;
};

export const clearRecentSearches = async () => {
  const response = await api.delete('/users/preferences/recent-searches');
  return response.data;
};

export const updateUserProfile = async (userData: any) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const changePassword = async (passwordData: any) => {
  const response = await api.put('/users/password', passwordData);
  return response.data;
};

export const deactivateAccount = async () => {
  const response = await api.put('/users/deactivate');
  return response.data;
};
