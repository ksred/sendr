import { PaymentOrder } from './payment';

export interface CurrencyBalance {
  currency: string;
  availableBalance: number;
  reservedBalance: number;
  pendingTransactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'PAYMENT' | 'EXCHANGE' | 'DEPOSIT' | 'WITHDRAWAL';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  amount: number;
  currency: string;
  timestamp: Date;
  relatedTransactionId?: string;
  paymentOrder?: PaymentOrder;
  metadata?: Record<string, unknown>;
}

export interface ReservationResult {
  success: boolean;
  reservationId?: string;
  balance?: CurrencyBalance;
  error?: string;
}

export interface UserHistory {
  recentTransactions: Transaction[];
  preferredCurrencies: string[];
  riskProfile: 'LOW' | 'MEDIUM' | 'HIGH';
  paymentFrequency: number;
  averagePaymentSize: number;
}

export interface AccountContext {
  balances: Record<string, CurrencyBalance>;
  limits: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
  utilizationRate: number;
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
}

export interface Account {
  id: number;
  account_id: string;
  user_id: number;
  name: string;
  type: string;
  balance: string;
  currency: string;
  is_active: boolean;
  description: string;
  is_default: boolean;
}
