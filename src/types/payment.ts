// Payment-related types
import { ExchangeRates } from './exchange';
import { UserHistory, AccountContext } from './account';

export type PaymentIntentType = 'DIRECT_PURCHASE' | 'PAYMENT_TO_PAYEE';
export type PaymentFrequency = 'one-time' | 'recurring';
export type PaymentTiming = 'immediate' | 'scheduled';

export interface PaymentOrder {
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
  beneficiary: {
    name: string;
    accountNumber: string;
    bankCode: string;
  };
  paymentPurpose?: string;
}

export interface PaymentIntent {
  type: PaymentIntentType;
  details: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    payeeDetails?: PayeeInformation;
    purpose?: string;
  };
  context: {
    marketRates: ExchangeRates;
    userHistory: UserHistory;
    accountContext: AccountContext;
  };
}

export interface PayeeInformation {
  name: string;
  accountNumber: string;
  bankCode: string;
  country?: string;
  currency?: string;
}

export interface PaymentEntities {
  payee?: {
    name: string;
    matchedPayee?: PayeeInformation;
  };
  amount?: {
    value: number;
    currency: string;
  };
  purpose?: string;
  timing?: PaymentTiming;
  frequency?: PaymentFrequency;
}

export interface ClarificationQuestions {
  missingFields: string[];
  questions: string[];
  suggestions?: {
    payees?: PayeeInformation[];
    amounts?: number[];
    currencies?: string[];
  };
}

export interface ConfirmationMessage {
  summary: string;
  details: {
    payee: string;
    sourceAmount: string;
    targetAmount: string;
    exchangeRate: string;
    fees: string;
    total: string;
  };
  warnings?: string[];
  confirmationPrompt: string;
}

export interface PaymentConfirmation {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  confirmationCode: string;
  timestamp: string;
  details: {
    sourceAmount: number;
    targetAmount: number;
    fees: number;
  };
}
