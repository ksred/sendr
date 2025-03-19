'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

interface ApiContextType {
  isAuthenticated: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  // Initialize the API client with auth token if available
  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      console.log('Setting API auth token from localStorage');
      api.setAuthToken(token);
    }
  }, []);

  const value = {
    isAuthenticated: auth.isAuthenticated(),
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