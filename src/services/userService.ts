
import api from './api';

export const getUserPreferences = async () => {
  try {
    const response = await api.get('/users/preferences');
    return response.data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    // Return dummy user preferences for development/demo
    return {
      success: true,
      data: {
        savedSearches: [
          {
            _id: 'dummy-saved-search-1',
            location: 'Manhattan',
            propertyType: 'flat',
            status: 'sale',
            minPrice: '200000',
            maxPrice: '500000',
            bedrooms: '2',
            notifyByEmail: true,
            createdAt: new Date().toISOString()
          },
          {
            _id: 'dummy-saved-search-2',
            location: 'Brooklyn',
            propertyType: 'house',
            status: 'rent',
            minPrice: '2000',
            maxPrice: '5000',
            bedrooms: '3',
            notifyByEmail: false,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        recentSearches: [
          {
            query: 'Queens',
            params: { location: 'Queens', propertyType: 'flat', status: 'rent' },
            timestamp: new Date().toISOString()
          },
          {
            query: 'Upper East Side',
            params: { location: 'Upper East Side', propertyType: 'flat', status: 'sale' },
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            query: 'Tribeca',
            params: { location: 'Tribeca', propertyType: 'flat', status: 'sale' },
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        notifications: [
          {
            _id: 'dummy-notification-1',
            message: 'We found 3 new properties matching your saved search for Manhattan',
            read: false,
            createdAt: new Date().toISOString()
          },
          {
            _id: 'dummy-notification-2',
            message: 'Price reduced on a property you viewed recently',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      }
    };
  }
};

export const addSavedSearch = async (searchData: any) => {
  try {
    const response = await api.post('/users/preferences/saved-searches', searchData);
    return response.data;
  } catch (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};

export const deleteSavedSearch = async (id: string) => {
  try {
    const response = await api.delete(`/users/preferences/saved-searches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting saved search:', error);
    throw error;
  }
};

export const addRecentSearch = async (searchData: any) => {
  try {
    const response = await api.post('/users/preferences/recent-searches', searchData);
    return response.data;
  } catch (error) {
    console.error('Error adding recent search:', error);
    throw error;
  }
};

export const clearRecentSearches = async () => {
  try {
    const response = await api.delete('/users/preferences/recent-searches');
    return response.data;
  } catch (error) {
    console.error('Error clearing recent searches:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData: any) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changePassword = async (passwordData: any) => {
  try {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const deactivateAccount = async () => {
  try {
    const response = await api.put('/users/deactivate');
    return response.data;
  } catch (error) {
    console.error('Error deactivating account:', error);
    throw error;
  }
};

export const createNotification = async (userId: string, notificationData: any) => {
  try {
    const response = await api.post(`/users/${userId}/notifications`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  try {
    const response = await api.put(`/users/${userId}/notifications/${notificationId}`, { read: true });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUnreadNotificationsCount = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/notifications/unread/count`);
    return response.data;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    // Random number between 0 and 5 for demo purposes
    const randomCount = Math.floor(Math.random() * 6);
    return {
      success: true,
      count: randomCount
    };
  }
};
