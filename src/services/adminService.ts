
import api from './api';

// Dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// Users management
export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// Properties management
export const notifyUsers = async (propertyIds: string[]) => {
  const response = await api.post('/admin/notify-users', { propertyIds });
  return response.data;
};

// Settings
export const getSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateSettings = async (settings: any) => {
  const response = await api.put('/admin/settings', settings);
  return response.data;
};

// Bug reports
export const getBugReports = async () => {
  const response = await api.get('/admin/bug-reports');
  return response.data;
};

export const updateBugReportStatus = async (id: string, status: string) => {
  const response = await api.put(`/admin/bug-reports/${id}/status`, { status });
  return response.data;
};

export const addBugReportNote = async (id: string, note: string) => {
  const response = await api.post(`/admin/bug-reports/${id}/notes`, { note });
  return response.data;
};
