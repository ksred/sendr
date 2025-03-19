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

  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching accounts...');
        const data = await api.accounts.list();
        console.log('Accounts loaded:', data);
        setAccounts(data);
      } catch (error: any) {
        console.error('Failed to load accounts:', error);
        // Log more details about the error for debugging
        if (error.message) console.error('Error message:', error.message);
        if (error.code) console.error('Error code:', error.code);
        if (error.details) console.error('Error details:', error.details);
        
        setError('Failed to load account information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

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