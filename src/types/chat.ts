import { PaymentOrder, PaymentIntent, PaymentEntities, ClarificationQuestions, ConfirmationMessage } from './payment';
import { FeeStructure, ExchangeRate } from './exchange';

export type ActionType =
  // Payment States
  | 'INTENT_ANALYSIS'     // Processing user input
  | 'ROUTE_CREATION'      // Determining payment route
  | 'FEE_ASSESSMENT'      // Calculating fees
  | 'FUNDS_CHECK'         // Verifying available funds
  | 'PROCESSING'          // Processing payment
  | 'COMPLETED'           // Finished
  | 'FAILED'             // Error occurred
  // LLM Processing Steps
  | 'PAYMENT_INITIATION'  // Initial payment request
  | 'PAYMENT_CONFIRMATION' // Payment confirmation
  | 'ENTITY_EXTRACTION'   // Extract payment entities
  | 'CLARIFICATION'       // Request missing information
  | 'BENEFICIARY_VALIDATION' // Validate beneficiary details
  | 'RISK_ASSESSMENT'     // Assess payment risk
  | 'CANCELLATION'        // Cancel payment
  | 'MULTIPLE_BENEFICIARIES' // Multiple beneficiaries found
  // New intent types from API
  | 'CURRENCY_EXCHANGE'   // Buy foreign currency
  | 'SHOW_BENEFICIARIES'  // Show beneficiary list
  | 'SHOW_TRANSACTIONS'   // Show transaction list
  | 'SHOW_PAYMENT_INTENTS' // Show payment intents
  | 'UNKNOWN'            // Unknown intent type
  // Forex specific types
  | 'SHOW_RATES'          // Show current forex rates
  | 'SHOW_ORDERS';        // Show active forex orders

// Base action data interface
export interface ActionData {
  intent?: {
    payment_id?: string;
    details?: {
      amount?: string;
      status?: string;
      from_currency?: string;
      to_currency?: string;
      converted_amount?: string;
      exchange_rate?: string;
      fees?: string;
      total_cost?: string;
      payeeDetails?: {
        name?: string;
        bankInfo?: string;
        matchConfidence?: number;
      };
    };
    confidence?: any;
  };
  entities?: PaymentEntities;
  clarification?: ClarificationQuestions;
  confirmation?: ConfirmationMessage;
  exchangeRate?: ExchangeRate;
  fees?: FeeStructure;
  progress?: number;
  error?: string;
  // Field for raw message with newlines (used for 'unknown' intent type)
  rawMessage?: string;
  // Fields for multiple beneficiaries scenario
  multipleBeneficiaries?: {
    message: string;
    amount: string;
    currency: string;
    originalRequest: string;
    beneficiaries: Array<{
      id: number;
      name: string;
      bankInfo: string;
      confidence: number;
    }>;
  };
  // New data types for the API response formats
  beneficiaries?: Array<{
    id: number;
    name: string;
    bank_info: string;
    currency: string;
  }>;
  transactions?: Array<{
    id: string;
    date: string;
    amount: string;
    currency: string;
    beneficiary: string;
    type: string;
    status: string;
  }>;
  paymentIntents?: any[];
  // Forex data types
  rates?: Array<{
    pair: string;
    rate: string;
    change: string;
  }>;
  orders?: Array<{
    id: string;
    description: string;
    amount: string;
    currency: string;
    status: string;
    type: string;
    rate: string;
  }>;
}

// Payment initiation specific action
export interface PaymentInitiationAction {
  type: 'PAYMENT_INITIATION' | 'ENTITY_EXTRACTION' | 'CLARIFICATION' | 'BENEFICIARY_VALIDATION' | 'RISK_ASSESSMENT' | 'CURRENCY_EXCHANGE';
  data: ActionData;
  options?: {
    confirm?: boolean;
    modify?: boolean;
  };
}

// Payment confirmation specific action
export interface PaymentConfirmationAction {
  type: 'PAYMENT_CONFIRMATION' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLATION';
  data: ActionData;
  options?: {
    cancel?: boolean;
  };
}

// Beneficiary and transaction display action
export interface DisplayAction {
  type: 'SHOW_BENEFICIARIES' | 'SHOW_TRANSACTIONS' | 'SHOW_PAYMENT_INTENTS' | 'SHOW_RATES' | 'SHOW_ORDERS';
  data: ActionData;
  options?: {
    viewDetails?: boolean;
  };
}

export type MessageAction = PaymentInitiationAction | PaymentConfirmationAction | DisplayAction;

export interface Message {
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  action?: MessageAction;
  // Payment-specific fields
  amount?: number;
  purpose?: string;
  paymentDetails?: {
    sourceCurrency?: string;
    targetCurrency?: string;
    beneficiary?: {
      name: string;
      accountNumber: string;
      bankCode: string;
    };
  };
}
