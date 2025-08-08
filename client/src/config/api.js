// API Configuration
// Change this URL when deploying to different environments
export const API_BASE_URL = 'https://roomnmeal.onrender.com';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/api/users/profile',
  },
  
  // Room endpoints
  ROOMS: {
    LIST: '/api/rooms',
    DETAIL: (id) => `/api/rooms/${id}`,
    HOST_ROOMS: '/api/rooms/host/my-rooms',
  },
  
  // Booking endpoints
  BOOKINGS: {
    CREATE: '/api/bookings',
    MY_BOOKINGS: '/api/bookings/my-bookings',
    UPDATE_STATUS: (id) => `/api/bookings/${id}/status`,
    STATS: '/api/bookings/stats/dashboard',
  },
  
  // Mess endpoints
  MESS: {
    PLANS: '/api/mess/plans',
    PLAN_DETAIL: (id) => `/api/mess/plans/${id}`,
    MY_SUBSCRIPTIONS: '/api/mess/my-subscriptions',
  },
  
  // Chat endpoints
  CHAT: {
    CONVERSATIONS: '/api/chat/conversations',
    MESSAGES: (id) => `/api/chat/messages/${id}`,
    SEND: '/api/chat/send',
  },
  
  // Admin endpoints
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    ROOMS: '/api/admin/rooms',
    BOOKINGS: '/api/admin/bookings',
    MESS_PLANS: '/api/admin/mess-plans',
    VERIFY_USER: (id) => `/api/admin/users/${id}/verify`,
    UPDATE_USER_STATUS: (id) => `/api/admin/users/${id}/status`,
    UPDATE_ROOM_STATUS: (id) => `/api/admin/rooms/${id}/status`,
    UPDATE_MESS_STATUS: (id) => `/api/admin/mess-plans/${id}/status`,
  },
}; 