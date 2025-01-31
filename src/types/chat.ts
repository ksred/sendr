import { PaymentOrder, PaymentIntent, PaymentEntities, ClarificationQuestions, ConfirmationMessage } from './payment';
import { MarketConditions } from './trading';
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
  | 'CANCELLATION';       // Cancel payment

// Base action data interface
export interface ActionData {
  type: ActionType;
  data: {
    intent?: PaymentIntent;
    entities?: PaymentEntities;
    clarification?: ClarificationQuestions;
    confirmation?: ConfirmationMessage;
    marketConditions?: MarketConditions;
    exchangeRate?: ExchangeRate;
    fees?: FeeStructure;
    progress?: number;
    error?: string;
  };
  options?: {
    confirm?: boolean;
    modify?: boolean;
    cancel?: boolean;
  };
}

// Payment initiation specific action
export interface PaymentInitiationAction extends ActionData {
  type: 'PAYMENT_INITIATION' | 'ENTITY_EXTRACTION' | 'CLARIFICATION' | 'BENEFICIARY_VALIDATION' | 'RISK_ASSESSMENT';
  data: {
    intent?: PaymentIntent;
    entities?: PaymentEntities;
    clarification?: ClarificationQuestions;
    marketConditions?: MarketConditions;
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
