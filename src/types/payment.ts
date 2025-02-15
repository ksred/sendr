// Payment-related types
import { ExchangeRates } from './exchange';
import { UserHistory, AccountContext } from './account';
import { APIPaymentIntent, APIPaymentIntentType } from './api/payment-intent';

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
  payment_id: string;
  amount: string;
  status: string;
  bank_info: string;
  beneficiary: {
    bank_info: string;
    id: number;
    match: number;
    name: string;
  };
  beneficiary_name: string;
  confidence: {
    amount: number;
    currency: number;
    beneficiary: number;
  };
  currency: string;
  from_currency: string;
  to_currency: string;
  purpose: string;
  suggestions: string[];
  total_cost: string;
  type: string;
}

export type ChatPaymentType = 'send' | 'request' | 'transfer' | 'exchange';
export type ChatPaymentStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'failed';

export interface ChatPaymentIntent {
  type: ChatPaymentType;
  status: ChatPaymentStatus;
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
  purpose: string;
  payee: {
    name: string;
    accountNumber?: string;
    bankCode?: string;
    bankName?: string;
  };
  fees?: {
    total: string;
    breakdown?: {
      transfer?: string;
      exchange?: string;
    };
  };
  suggestions?: string[];
  error?: string;
}

export interface PayeeInformation {
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName?: string;
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

export interface PaymentEntities {
  amount?: number;
  currency?: string;
  payee?: PayeeInformation;
  purpose?: string;
  date?: string;
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

export interface ClarificationQuestions {
  questions: Array<{
    field: string;
    question: string;
    options?: string[];
  }>;
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

export interface ConfirmationMessage {
  title: string;
  message: string;
  details: {
    amount: string;
    fee: string;
    total: string;
    recipient: string;
    eta: string;
  };
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

// Utility function to convert API PaymentIntent to Chat PaymentIntent
export function apiToChat(api: APIPaymentIntent): ChatPaymentIntent {
  return {
    type: apiTypeToChat(api.type),
    status: apiStatusToChat(api.status),
    amount: api.amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    sourceCurrency: api.sourceCurrency,
    targetCurrency: api.targetCurrency,
    purpose: api.suggestions?.[0]?.reason || '',
    payee: {
      name: api.payeeDetails.name,
      accountNumber: api.payeeDetails.accountNumber,
      bankCode: api.payeeDetails.bankCode,
      bankName: api.payeeDetails.bankName
    },
    fees: api.context.fees ? {
      total: api.context.fees.totalFee.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      breakdown: {
        transfer: api.context.fees.transferFee.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        exchange: api.context.fees.exchangeFee.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
    } : undefined,
    suggestions: api.suggestions?.map(s => s.reason).filter(Boolean) as string[],
    error: api.error
  };
}

// Utility function to convert Chat PaymentIntent to API format
export function chatToApi(chat: ChatPaymentIntent): Partial<APIPaymentIntent> {
  return {
    type: chatTypeToApi(chat.type),
    amount: parseFloat(chat.amount.replace(/[^0-9.]/g, '')),
    sourceCurrency: chat.sourceCurrency,
    targetCurrency: chat.targetCurrency,
    payeeDetails: {
      name: chat.payee.name,
      accountNumber: chat.payee.accountNumber || '',
      bankCode: chat.payee.bankCode || '',
      bankName: chat.payee.bankName
    }
  };
}

function apiTypeToChat(type: APIPaymentIntentType): ChatPaymentType {
  switch (type) {
    case 'PAYMENT_TO_PAYEE':
      return 'send';
    case 'PAYMENT_TO_SELF':
      return 'transfer';
    case 'PAYMENT_TO_BANK':
      return 'transfer';
    default:
      return 'send';
  }
}

function chatTypeToApi(type: ChatPaymentType): APIPaymentIntentType {
  switch (type) {
    case 'send':
      return 'PAYMENT_TO_PAYEE';
    case 'transfer':
      return 'PAYMENT_TO_SELF';
    case 'exchange':
      return 'PAYMENT_TO_SELF';
    case 'request':
      return 'PAYMENT_TO_PAYEE';
    default:
      return 'PAYMENT_TO_PAYEE';
  }
}

function apiStatusToChat(status: string): ChatPaymentStatus {
  switch (status) {
    case 'created':
      return 'draft';
    case 'processing':
      return 'processing';
    case 'requires_confirmation':
      return 'pending';
    case 'confirmed':
      return 'processing';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    case 'cancelled':
      return 'failed';
    default:
      return 'draft';
  }
}
