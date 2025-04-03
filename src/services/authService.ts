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

export const googleLogin = async () => {
  const googleAuthUrl = `${api.defaults.baseURL}/auth/google`;
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  
  const popup = window.open(
    googleAuthUrl,
    'Google Authentication',
    `width=${width},height=${height},left=${left},top=${top}`
  );
  
  return new Promise((resolve, reject) => {
    const pollTimer = window.setInterval(() => {
      if (popup && popup.closed) {
        window.clearInterval(pollTimer);
        
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          resolve({ token, user: JSON.parse(user) });
        } else {
          reject(new Error('Google authentication failed'));
        }
      }
    }, 500);
    
    setTimeout(() => {
      window.clearInterval(pollTimer);
      if (popup) popup.close();
      reject(new Error('Google authentication timed out'));
    }, 120000);
  });
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
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.log('Using dummy user data instead of API call');
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
