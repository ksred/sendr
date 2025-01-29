'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { tradingApi } from '@/lib/api/mock-trading-api';
import { Position } from '@/types/trading';

interface AccountContextType {
  positions: Position[];
  isLoading: boolean;
  balance: number;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await tradingApi.getPositions();
        setPositions(data);
      } catch (error) {
        console.error('Failed to load positions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPositions();
  }, []);

  const value = {
    positions,
    isLoading,
    balance: 1250000, // This would come from the API in a real app
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
