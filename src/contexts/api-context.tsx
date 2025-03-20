'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

interface ApiContextType {
  isAuthenticated: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  // Track authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize the API client with auth token if available
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const token = auth.getToken();
    if (token) {
      console.log('ApiProvider: Setting API auth token from localStorage');
      api.setAuthToken(token);
      setIsAuthenticated(true);
    } else {
      console.warn('ApiProvider: No auth token found in localStorage');
      setIsAuthenticated(false);
    }
    
    // Listen for storage events to handle token changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_token') {
        if (event.newValue) {
          console.log('ApiProvider: Auth token changed in storage, updating API client');
          api.setAuthToken(event.newValue);
          setIsAuthenticated(true);
        } else {
          console.log('ApiProvider: Auth token removed from storage');
          setIsAuthenticated(false);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    isAuthenticated,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}