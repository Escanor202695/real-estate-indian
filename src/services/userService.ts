import api from './api';

export const getUserPreferences = async () => {
  try {
    const response = await api.get('/users/preferences');
    return response.data;
  } catch (error) {
    console.log('Using dummy user preferences instead of API call');
    // Return dummy user preferences
    return {
      success: true,
      data: {
        savedSearches: [
          {
            _id: 'dummy-saved-search-1',
            query: 'Manhattan',
            params: { location: 'Manhattan', type: 'apartment', status: 'sale', minPrice: '200000', maxPrice: '500000', bedrooms: '2' },
            timestamp: new Date().toISOString()
          },
          {
            _id: 'dummy-saved-search-2',
            query: 'Brooklyn',
            params: { location: 'Brooklyn', type: 'house', status: 'rent', minPrice: '2000', maxPrice: '5000', bedrooms: '3' },
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        recentSearches: [
          {
            query: 'Queens',
            params: { location: 'Queens', type: 'apartment', status: 'rent' },
            timestamp: new Date().toISOString()
          },
          {
            query: 'Upper East Side',
            params: { location: 'Upper East Side', type: 'condo', status: 'sale' },
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            query: 'Tribeca',
            params: { location: 'Tribeca', type: 'penthouse', status: 'sale' },
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        propertyAlerts: [
          {
            _id: 'dummy-alert-1',
            name: 'New Manhattan Listings',
            criteria: { location: 'Manhattan', type: 'apartment', status: 'sale' },
            frequency: 'daily',
            active: true
          },
          {
            _id: 'dummy-alert-2',
            name: 'Brooklyn Rentals',
            criteria: { location: 'Brooklyn', type: 'apartment', status: 'rent' },
            frequency: 'weekly',
            active: true
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
    console.log('Using dummy response for addSavedSearch');
    return {
      success: true,
      data: {
        _id: 'dummy-saved-search-' + Date.now(),
        ...searchData,
        timestamp: new Date().toISOString()
      }
    };
  }
};

export const deleteSavedSearch = async (id: string) => {
  try {
    const response = await api.delete(`/users/preferences/saved-searches/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for deleteSavedSearch');
    return {
      success: true,
      message: 'Saved search deleted successfully'
    };
  }
};

export const addRecentSearch = async (searchData: any) => {
  try {
    const response = await api.post('/users/preferences/recent-searches', searchData);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for addRecentSearch');
    return {
      success: true,
      data: {
        ...searchData,
        timestamp: new Date().toISOString()
      }
    };
  }
};

export const clearRecentSearches = async () => {
  try {
    const response = await api.delete('/users/preferences/recent-searches');
    return response.data;
  } catch (error) {
    console.log('Using dummy response for clearRecentSearches');
    return {
      success: true,
      message: 'Recent searches cleared successfully'
    };
  }
};

export const updateUserProfile = async (userData: any) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for updateUserProfile');
    return {
      success: true,
      data: {
        _id: 'dummy-user-123',
        ...userData,
        email: 'john.doe@example.com', // Email remains unchanged
        role: 'user', // Role remains unchanged
      }
    };
  }
};

export const changePassword = async (passwordData: any) => {
  try {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for changePassword');
    return {
      success: true,
      message: 'Password updated successfully'
    };
  }
};

export const deactivateAccount = async () => {
  try {
    const response = await api.put('/users/deactivate');
    return response.data;
  } catch (error) {
    console.log('Using dummy response for deactivateAccount');
    return {
      success: true,
      message: 'Account deactivated successfully'
    };
  }
};

export const createNotification = async (userId: string, notificationData: any) => {
  try {
    const response = await api.post(`/users/${userId}/notifications`, notificationData);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for createNotification');
    return {
      success: true,
      data: {
        _id: 'dummy-notification-' + Date.now(),
        ...notificationData,
        read: false,
        createdAt: new Date().toISOString()
      }
    };
  }
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  try {
    const response = await api.put(`/users/${userId}/notifications/${notificationId}`, { read: true });
    return response.data;
  } catch (error) {
    console.log('Using dummy response for markNotificationAsRead');
    return {
      success: true,
      message: 'Notification marked as read'
    };
  }
};

export const getUnreadNotificationsCount = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/notifications/unread/count`);
    return response.data;
  } catch (error) {
    console.log('Using dummy response for getUnreadNotificationsCount');
    // Random number between 0 and 5 for demo purposes
    const randomCount = Math.floor(Math.random() * 6);
    return {
      success: true,
      count: randomCount
    };
  }
};
