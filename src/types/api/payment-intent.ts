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

export interface ProcessedPaymentIntent {
  payment_id: string;
  amount: string;
  bank_info: string;
  beneficiary: ProcessedBeneficiary;
  beneficiary_name: string;
  confidence: PaymentConfidence;
  converted_amount: string;
  currency: string;
  exchange_rate: string;
  fees: string;
  from_currency: string;
  purpose: string;
  suggestions: PaymentSuggestion[];
  to_currency: string;
  total_cost: string;
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
