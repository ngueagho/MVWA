// ============================================
// 1. NOUVEAU FICHIER: utils/api.js
// ============================================

// utils/api.js - Service API centralisé
const API_BASE_URL = 'http://localhost:8000/api';

class UrbanTendanceAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Headers par défaut
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      // Gérer les erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error:`, error);
      throw error;
    }
  }

  // ============================================
  // AUTHENTIFICATION
  // ============================================

  async login(credentials) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (data.success && data.token) {
      this.token = data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
      }
    }
    
    return data;
  }

  // ============================================
  // ENDPOINTS ADMIN
  // ============================================

  async getAdminStats() {
    return this.request('/admin/stats/');
  }

  async getAdminUsers() {
    return this.request('/admin/users/');
  }

  async searchUsers(query) {
    return this.request(`/admin/users/search/?q=${encodeURIComponent(query)}`);
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}/delete/`, {
      method: 'DELETE'
    });
  }

  async getAdminOrders() {
    return this.request('/admin/orders/');
  }

  async executeSQL(query) {
    return this.request('/admin/execute-sql/', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  // ============================================
  // PRODUITS
  // ============================================

  async getAllProducts() {
    return this.request('/products/all/');
  }

  async getProductsStats() {
    return this.request('/products/stats/');
  }

  // ============================================
  // DEBUG ET TEST
  // ============================================

  async getDebugInfo() {
    return this.request('/debug/');
  }

  async createTestData() {
    return this.request('/create-test-data/', {
      method: 'POST'
    });
  }
}

// Instance singleton
const urbanAPI = new UrbanTendanceAPI();
export default urbanAPI;
