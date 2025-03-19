interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  data: {
    token: string;
    expiresIn: number;
    user: User;
  };
  success: boolean;
}

// Store auth data in localStorage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const auth = {
  setToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    // Set cookie for middleware with proper attributes
    // Make sure it's readable by the middleware
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    console.log('Auth token set:', token);
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setUser(user: User) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  clear() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    // Clear the auth cookie properly
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    console.log('Auth cleared');
  },

  // Check both localStorage and cookie to ensure consistency
  isAuthenticated(): boolean {
    const localToken = this.getToken();
    // Also check the cookie
    const cookieToken = this.getCookie('auth_token');
    
    console.log('Auth check - localStorage:', !!localToken, 'cookie:', !!cookieToken);
    
    // If either is missing, try to sync them
    if (localToken && !cookieToken) {
      console.log('Repairing missing cookie');
      this.setToken(localToken); // Recreate the cookie
    }
    
    return !!localToken;
  },
  
  // Helper to get a cookie value
  getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  },

  getAuthHeader(): { Authorization: string } | undefined {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }
};

export type { User, AuthResponse };
