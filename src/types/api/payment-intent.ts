import { Payment, PaymentMethod, PaymentPriority } from './payment';
import { Beneficiary } from './beneficiary';

export interface PaymentIntent {
  id: string;
  rawInput: string;  // Original user input
  status: 'pending_confirmation' | 'confirmed' | 'rejected' | 'expired';
  parsed: {
    beneficiary: {
      id?: string;  // If matched to existing beneficiary
      name: string;
      matchConfidence?: number;
      possibleMatches?: Array<{
        id: string;
        name: string;
        confidence: number;
      }>;
    };
    amount: {
      value: number;
      currency: string;
      isApproximate: boolean;
    };
    timing?: {
      scheduledDate?: string;
      priority?: PaymentPriority;
      recurring?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        endDate?: string;
      };
    };
    purpose?: string;
    notes?: string;
  };
  suggestion: {
    payment: Omit<Payment, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
    alternativeOptions?: Array<{
      field: string;
      currentValue: any;
      suggestedValue: any;
      reason: string;
    }>;
    warnings?: Array<{
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  };
  requiresConfirmation: boolean;
  confirmationDetails?: Array<{
    field: string;
    value: any;
    requiresExplicitConfirmation: boolean;
    reason?: string;
  }>;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
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
