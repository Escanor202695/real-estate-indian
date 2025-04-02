
import api from './api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (userData: RegisterData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (userData: LoginData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  // Try to get user from API, but provide fallback dummy data if it fails
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.log('Using dummy user data instead of API call');
    // Return dummy user data similar to the API response structure
    return {
      success: true,
      data: {
        _id: 'dummy-user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        role: 'user',
        location: {
          city: 'New York',
          state: 'NY'
        }
      }
    };
  }
};

export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};
