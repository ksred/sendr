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
    // Also set cookie for middleware
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Strict`;
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
    // Clear the auth cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getAuthHeader(): { Authorization: string } | undefined {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }
};

export type { User, AuthResponse };
