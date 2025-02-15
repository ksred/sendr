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
  // Transaction History
  | 'TRANSACTION_LIST'    // List transactions
  | 'TRANSACTION_DETAIL'  // Show transaction details
  // Beneficiary Management
  | 'BENEFICIARY_LIST'    // List beneficiaries
  | 'BENEFICIARY_ADD'     // Add new beneficiary
  | 'BENEFICIARY_EDIT'    // Edit beneficiary
  | 'BENEFICIARY_DELETE'; // Delete beneficiary

// Base action data interface
export interface ActionData {
  type: ActionType;
  data: {
    intent?: PaymentIntent;
    entities?: PaymentEntities;
    clarification?: ClarificationQuestions;
    confirmation?: ConfirmationMessage;
    exchangeRate?: ExchangeRate;
    fees?: FeeStructure;
    progress?: number;
    error?: string;
    transactions?: Transaction[];
    transaction?: Transaction;
    beneficiaries?: Beneficiary[];
    beneficiary?: Beneficiary;
  };
  options?: {
    confirm?: boolean;
    modify?: boolean;
    cancel?: boolean;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
}

export interface Transaction {
  id: string;
  date: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  beneficiary: Beneficiary;
  description?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName?: string;
  country?: string;
  currency?: string;
  email?: string;
  lastUsed?: string;
}

// Payment initiation specific action
export interface PaymentInitiationAction extends ActionData {
  type: 'PAYMENT_INITIATION' | 'ENTITY_EXTRACTION' | 'CLARIFICATION' | 'BENEFICIARY_VALIDATION' | 'RISK_ASSESSMENT';
  data: {
    intent?: PaymentIntent;
    entities?: PaymentEntities;
    clarification?: ClarificationQuestions;
    fees?: FeeStructure;
  };
  options?: {
    confirm?: boolean;
    modify?: boolean;
  };
}

// Payment confirmation specific action
export interface PaymentConfirmationAction extends ActionData {
  type: 'PAYMENT_CONFIRMATION' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLATION';
  data: {
    intent: PaymentIntent;
    confirmation?: ConfirmationMessage;
    progress: number;
    error?: string;
  };
  options?: {
    cancel?: boolean;
  };
}

export type MessageAction = PaymentInitiationAction | PaymentConfirmationAction;

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
