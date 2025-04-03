
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
  rememberMe?: boolean;
}

interface PasswordResetData {
  email: string;
  otp: string;
  newPassword: string;
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

    // Handle remember me functionality
    if (userData.rememberMe) {
      localStorage.setItem('rememberedEmail', userData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  }
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (resetData: PasswordResetData) => {
  try {
    const response = await api.post('/auth/reset-password', resetData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const getRememberedEmail = (): string | null => {
  return localStorage.getItem('rememberedEmail');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Don't remove rememberedEmail as we want it to persist even after logout
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};
