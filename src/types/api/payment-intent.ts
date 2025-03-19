import { Payment, PaymentMethod, PaymentPriority } from './payment';
import { Beneficiary } from './beneficiary';

export interface ProcessedBeneficiary {
  id?: number;
  name: string;
  bank_info?: string;
  match?: number;
}

export interface PaymentConfidence {
  amount: number;
  currency: number;
  beneficiary: number;
}

export interface PaymentSuggestion {
  amount: string;
  currency: string;
  beneficiaryInfo: {
    name: string;
    bankInfo: string;
    matchedId: number | null;
  };
  reason: string;
}

// Original ProcessedPaymentIntent type (keeping for backward compatibility)
export interface ProcessedPaymentIntent {
  // Common fields from API response
  intent_type?: string;
  confidence?: number;
  error?: string;
  result?: any;
  
  // Legacy fields
  payment_id?: string;
  amount?: string;
  bank_info?: string;
  beneficiary?: ProcessedBeneficiary;
  beneficiary_name?: string;
  converted_amount?: string;
  currency?: string;
  exchange_rate?: string;
  fees?: string;
  from_currency?: string;
  purpose?: string;
  suggestions?: PaymentSuggestion[];
  to_currency?: string;
  total_cost?: string;
}

// New interfaces based on api.md
export interface ApiIntentResponse {
  intent_type: string;
  confidence: number;
  requires_clarification?: boolean;
  result: any;
}

export interface PaymentIntentResult {
  amount: string;
  currency: string;
  beneficiary_name?: string;
  purpose?: string;
  exchange_rate?: string;
  fee?: string;
  confidence?: {
    amount: number;
    currency: number;
    beneficiary: number;
  };
  // Fields for multiple beneficiaries scenario
  beneficiaries?: Array<{
    Beneficiary: {
      id: number;
      name: string;
      bank_info: string;
      currency: string;
    };
    confidence: number;
  }>;
  message?: string;
  options?: string;
  original_request?: string;
  type?: string;
}

export interface BuyForeignCurrencyResult {
  amount: string;
  from_currency: string;
  to_currency: string;
  rate: string;
  converted_amount: string;
  fee: string;
  total_cost: string;
  confidence: {
    amount: number;
    from_currency: number;
    to_currency: number;
  };
}

export interface ShowBeneficiaryResult {
  beneficiary: {
    id: number;
    name: string;
    bank_info: string;
    currency: string;
  };
  confidence: number;
}

export interface TransactionResult {
  id: string;
  date: string;
  amount: string;
  currency: string;
  beneficiary: string;
  type: string;
  status: string;
}

export interface PaymentIntentError {
  error: string;
}

export interface PaymentIntent {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  id: string;
  paymentId: string;
  rawInput: string;  // Original user input
  status: string;
  userId: number;
  user: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Email: string;
    Password: string;
    FirstName: string;
    LastName: string;
    Active: boolean;
  };
  processedAt: string | null;
  amount: string;
  currency: string;
  beneficiaryName: string;
  beneficiaryBankInfo: string;
  convertedAmount: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: string;
  fee: string;
  totalCost: string;
  errorDetails: string;
  confidence: PaymentConfidence;
  suggestions: PaymentSuggestion[];
  requiresConfirmation: boolean;
  confirmationDetails?: Array<{
    field: string;
    value: any;
    requiresExplicitConfirmation: boolean;
    reason?: string;
  }>;
  expiresAt: string;
}

export interface CreatePaymentIntentRequest {
  input: string;
  contextData?: {
    preferredCurrency?: string;
    recentBeneficiaries?: string[];
    maxAmount?: number;
  };
}

export interface ConfirmPaymentIntentRequest {
  id: string;
  confirmedFields?: Record<string, any>;
  selectedAlternatives?: Record<string, any>;
}

export interface PaymentIntentValidation {
  isValid: boolean;
  missingFields: string[];
  ambiguousFields: Array<{
    field: string;
    possibleValues: any[];
    currentSelection?: any;
  }>;
  confirmationRequired: boolean;
  userActionRequired: boolean;
}
