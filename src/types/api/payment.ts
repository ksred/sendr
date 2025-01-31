export type PaymentStatus = 
  | 'draft'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Payment {
  id: string;
  beneficiaryId: string;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  fees: {
    exchangeFee: number;
    networkFee: number;
    processingFee: number;
    total: number;
  };
  status: PaymentStatus;
  reference?: string;
  purpose?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreatePaymentRequest {
  beneficiaryId: string;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  reference?: string;
  purpose?: string;
  metadata?: Record<string, any>;
}

export interface ModifyPaymentRequest {
  id: string;
  amount?: number;
  reference?: string;
  purpose?: string;
  metadata?: Record<string, any>;
}

export interface PaymentStatusResponse {
  id: string;
  status: PaymentStatus;
  progress?: number;
  lastUpdated: string;
  estimatedCompletion?: string;
  statusMessage?: string;
}

export interface ValidatePaymentRequest {
  beneficiaryId: string;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
}

export interface ValidatePaymentResponse {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  limits?: {
    remaining: {
      daily: number;
      monthly: number;
      perTransaction: number;
    };
    exceeded: boolean;
  };
}
