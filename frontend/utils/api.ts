// frontend/utils/api.ts - CORRIGÉ pour vos endpoints réels

// CORRECTION 1: Bonne URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class UrbanAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      console.log(`🔗 API Call: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, defaultOptions);
      
      // Vérifier si la réponse est du JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error(`Expected JSON response, got: ${contentType}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ API Success: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // =====================================
  // AUTHENTIFICATION DJANGO ADMIN - CORRIGÉE
  // =====================================
  
  async loginDjangoAdmin(credentials: { username: string; password: string }) {
    try {
      console.log('🔐 Tentative de connexion Django Admin:', credentials.username);
      
      // CORRECTION 2: Utiliser le bon endpoint qui fonctionne
      const response = await this.makeRequest('/api/users/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // CORRECTION 3: Adapter au format de réponse réel de votre API
      // Votre API retourne: {"token": "...", "user": {...}}
      // Pas de field "success"
      
      if (response.token && response.user) {
        // Stocker les informations d'authentification
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        
        // Créer les permissions basées sur le user
        const permissions = {
          can_add_users: response.user.is_superuser || false,
          can_delete_users: response.user.is_superuser || false,
          can_execute_sql: response.user.is_superuser || false,
          can_view_logs: response.user.is_staff || false,
          can_manage_products: response.user.is_staff || false,
          can_manage_orders: response.user.is_staff || false
        };
        localStorage.setItem('user_permissions', JSON.stringify(permissions));
        
        console.log('🔐 Django Admin Authentication Success:', response.user);
        
        // Retourner dans le format attendu par votre frontend
        return {
          success: true,
          user: response.user,
          token: response.token,
          permissions: permissions
        };
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('🚨 Django Admin Auth Error:', error);
      throw { success: false, error: error.message };
    }
  }

  // Méthode de login générique (pour compatibilité)
  async login(credentials: { username: string; password: string }) {
    return await this.loginDjangoAdmin(credentials);
  }

  async logout() {
    try {
      // Nettoyer le localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_permissions');
      
      console.log('🚪 Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Vérifier si l'utilisateur est connecté et admin
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  }

  isAdmin(): boolean {
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) return false;
      
      const user = JSON.parse(userData);
      return user.is_staff || user.is_superuser || user.role === 'admin';
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  getUserPermissions() {
    try {
      const permissions = localStorage.getItem('user_permissions');
      return permissions ? JSON.parse(permissions) : {};
    } catch {
      return {};
    }
  }

  // =====================================
  // API ADMIN DASHBOARD - CORRIGÉES
  // =====================================

  async getAdminStats() {
    return await this.makeRequest('/api/admin/stats/');
  }

  async getAdminUsers() {
    return await this.makeRequest('/api/admin/users/');
  }

  async searchUsers(query: string) {
    return await this.makeRequest('/api/admin/users/search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async deleteUser(userId: number) {
    return await this.makeRequest(`/api/admin/users/${userId}/delete/`, {
      method: 'POST',
    });
  }

  async getAdminOrders() {
    return await this.makeRequest('/api/admin/orders/');
  }

  // =====================================
  // API SQL DANGEREUSE (FAILLE) - CORRIGÉE
  // =====================================
  
  async executeSQL(sqlQuery: string) {
    console.warn('🚨 DANGER: Exécution SQL directe!', sqlQuery);
    return await this.makeRequest('/api/admin/execute-sql/', {
      method: 'POST',
      body: JSON.stringify({ query: sqlQuery }),
    });
  }

  // =====================================
  // API PRODUITS - CORRIGÉES
  // =====================================

  async getAllProducts() {
    return await this.makeRequest('/api/products/all/');
  }

  async getProductsStats() {
    return await this.makeRequest('/api/products/stats/');
  }

  // =====================================
  // API DEBUG ET TEST - CORRIGÉES
  // =====================================

  async getDebugInfo() {
    return await this.makeRequest('/api/debug/');
  }

  async createTestData() {
    return await this.makeRequest('/api/create-test-data/', {
      method: 'POST',
    });
  }

  // =====================================
  // MÉTHODES UTILITAIRES - CORRIGÉES
  // =====================================

  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/api/debug/`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Méthode pour vérifier le statut de l'API
  async getApiStatus() {
    try {
      const isConnected = await this.testConnection();
      return {
        connected: isConnected,
        baseURL: this.baseURL,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        baseURL: this.baseURL,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // =====================================
  // LEGACY METHODS (pour compatibilité) - CORRIGÉES
  // =====================================

  async register(userData: any) {
    return await this.makeRequest('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProducts() {
    return await this.getAllProducts();
  }

  // =====================================
  // FAILLES INTENTIONNELLES
  // =====================================

  // FAILLE: Méthode pour exposer des informations sensibles
  async getSystemInfo() {
    console.warn('🚨 FAILLE: Récupération d\'informations système sensibles');
    return {
      localStorage_content: { ...localStorage },
      session_data: this.getCurrentUser(),
      api_endpoints: [
        '/api/admin/execute-sql/',
        '/api/admin/users/',
        '/.env',
        '/backup/'
      ],
      vulnerable_queries: [
        "admin' OR '1'='1",
        "1'; DROP TABLE auth_user; --",
        "' UNION SELECT username, password FROM auth_user --"
      ]
    };
  }

  // FAILLE: Méthode pour tester les injections SQL
  async testSQLInjection(payload: string) {
    console.warn('🚨 FAILLE: Test d\'injection SQL', payload);
    try {
      return await this.searchUsers(payload);
    } catch (error) {
      return {
        error: error.message,
        payload_tested: payload,
        suggestion: "Essayez: admin' OR '1'='1"
      };
    }
  }
}

// Instance globale
const urbanAPI = new UrbanAPI();

// Export pour utilisation dans les composants
export default urbanAPI;

// Export des types pour TypeScript
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
  role?: string;
  last_login?: string;
  date_joined?: string;
}

export interface UserPermissions {
  can_add_users: boolean;
  can_delete_users: boolean;
  can_execute_sql: boolean;
  can_view_logs: boolean;
  can_manage_products: boolean;
  can_manage_orders: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper pour vérifications d'authentification
export const authUtils = {
  isLoggedIn: () => urbanAPI.isAuthenticated(),
  isAdmin: () => urbanAPI.isAdmin(),
  getCurrentUser: () => urbanAPI.getCurrentUser(),
  getPermissions: () => urbanAPI.getUserPermissions(),
  
  // FAILLE: Helper pour bypass d'authentification
  bypassAuth: () => {
    console.warn('🚨 FAILLE: Bypass d\'authentification activé');
    const fakeAdmin = {
      id: 999,
      username: 'bypassed_admin',
      email: 'bypass@hack.com',
      is_staff: true,
      is_superuser: true,
      role: 'admin'
    };
    localStorage.setItem('auth_token', 'bypass_token_' + Date.now());
    localStorage.setItem('user_data', JSON.stringify(fakeAdmin));
    return fakeAdmin;
  }
};