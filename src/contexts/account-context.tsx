'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Position, PaymentOrder, PaymentConfirmation } from '@/types/trading';
import { Account } from '@/types/account';
import api from '@/lib/api';

interface AccountContextType {
  accounts: Account[];
  positions: Position[];
  isLoading: boolean;
  error: string | null;
  defaultAccount: Account | null;
  getAccountBalance: () => string;
  getAccountCurrency: () => string;
  currentPayment: PaymentOrder | null;
  paymentHistory: PaymentConfirmation[];
  exchangeRates: Record<string, number>;
  refreshAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPayment, setCurrentPayment] = useState<PaymentOrder | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentConfirmation[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  // Get the default account (the one marked as is_default)
  const defaultAccount = accounts.find(account => account.is_default) || accounts[0] || null;

  const getAccountBalance = () => {
    return defaultAccount?.balance || '0';
  };

  const getAccountCurrency = () => {
    return defaultAccount?.currency || 'USD';
  };

  // Function to load accounts that can be called from outside the useEffect
  const loadAccounts = async () => {
    // Don't fetch accounts on authentication pages
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      // Skip account loading for authentication pages
      if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
        setIsLoading(false);
        return;
      }
    }
    
    setIsLoading(true);
    try {
      console.log('AccountContext: Loading accounts data');
      const data = await api.accounts.list();
      console.log('AccountContext: Accounts loaded successfully:', data);
      setAccounts(data);
    } catch (error: any) {
      // Check specifically for unauthorized errors
      if (error.code === 'UNAUTHORIZED' || error.message?.includes('session') || error.message?.includes('log in')) {
        console.error('Account context: Authentication error detected when loading accounts');
        
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          // Only redirect if we're not already on an auth page
          if (pathname !== '/login' && pathname !== '/register' && pathname !== '/forgot-password') {
            window.location.href = '/login?error=session_expired&source=account';
          }
        }
        
        // Still set the error for components that may be rendering
        setError('Your session has expired. Redirecting to login...');
        return; // Stop further processing
      }
      
      // For other errors, show a generic message
      setError('Failed to load account information. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Call loadAccounts when component mounts
  useEffect(() => {
    loadAccounts();
  }, []);

  // Mock positions for now - would come from a real API in production
  useEffect(() => {
    // Set mock positions data
    setPositions([
      {
        id: '1',
        symbol: 'EUR/USD',
        quantity: 10000,
        currency: 'EUR',
        pnl: 250.75
      },
      {
        id: '2',
        symbol: 'GBP/USD',
        quantity: 5000,
        currency: 'GBP',
        pnl: -120.35
      }
    ]);
  }, []);

  const value = {
    accounts,
    positions,
    isLoading,
    error,
    defaultAccount,
    getAccountBalance,
    getAccountCurrency,
    currentPayment,
    paymentHistory,
    exchangeRates,
    refreshAccounts: loadAccounts,
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