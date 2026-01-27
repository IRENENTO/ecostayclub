/**
 * API Integration Module for EcoStay
 * Handles all communication between frontend and backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ====== UTILITY FUNCTIONS ======
export async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    showToast(error.message, 'error');
    throw error;
  }
}

// ====== AUTHENTICATION API ======
export const authAPI = {
  register: async (name, email, password) => {
    return apiCall('/auth/register', 'POST', { name, email, password });
  },

  login: async (email, password) => {
    const result = await apiCall('/auth/login', 'POST', { email, password });
    if (result.token) {
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    return result;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
};

// ====== MEMBERS API ======
export const membersAPI = {
  getAll: () => apiCall('/members', 'GET'),
  
  getById: (id) => apiCall(`/members/${id}`, 'GET'),
  
  create: (data) => apiCall('/members', 'POST', data),
  
  update: (id, data) => apiCall(`/members/${id}`, 'PUT', data),
  
  delete: (id) => apiCall(`/members/${id}`, 'DELETE')
};

// ====== EVENTS API ======
export const eventsAPI = {
  getAll: () => apiCall('/events', 'GET'),
  
  getById: (id) => apiCall(`/events/${id}`, 'GET'),
  
  create: (data) => apiCall('/events', 'POST', data),
  
  update: (id, data) => apiCall(`/events/${id}`, 'PUT', data),
  
  delete: (id) => apiCall(`/events/${id}`, 'DELETE')
};

// ====== POSTS/FEED API ======
export const postsAPI = {
  getAll: () => apiCall('/posts', 'GET'),
  
  create: (data) => apiCall('/posts', 'POST', data),
  
  delete: (id) => apiCall(`/posts/${id}`, 'DELETE')
};

// ====== DASHBOARD/STATS API ======
export const statsAPI = {
  getStats: () => apiCall('/stats', 'GET'),
  
  updateStats: (type, value) => apiCall('/stats/update', 'POST', { type, value }),
  
  getDashboard: () => apiCall('/admin/dashboard', 'GET')
};

// ====== NOTIFICATIONS API ======
export const notificationsAPI = {
  getAll: () => apiCall('/notifications', 'GET')
};

// ====== SEARCH API ======
export const searchAPI = {
  search: (query) => apiCall(`/search?q=${encodeURIComponent(query)}`, 'GET')
};

// ====== EXPORT API ======
export const exportAPI = {
  exportMembers: () => apiCall('/export/members', 'GET'),
  
  exportEvents: () => apiCall('/export/events', 'GET')
};

// ====== HELPER FUNCTIONS ======
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  const container = document.getElementById('toast-container') || document.body;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Initialize API on page load
if (typeof window !== 'undefined') {
  window.apiCall = apiCall;
  window.authAPI = authAPI;
  window.membersAPI = membersAPI;
  window.eventsAPI = eventsAPI;
  window.postsAPI = postsAPI;
  window.statsAPI = statsAPI;
  window.notificationsAPI = notificationsAPI;
  window.searchAPI = searchAPI;
  window.exportAPI = exportAPI;
  window.showToast = showToast;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ API Integration Module Loaded');
});
