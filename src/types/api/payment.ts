export type PaymentStatus = 
  | 'draft'
  | 'pending_approval'
  | 'pending_aml'
  | 'pending_funds'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type PaymentPriority = 'normal' | 'urgent' | 'same_day';
export type PaymentMethod = 'swift' | 'sepa' | 'ach' | 'wire' | 'local';

export interface IntermediaryBank {
  bankName: string;
  swiftBic: string;
  accountNumber?: string;
  iban?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface PaymentRouting {
  method: PaymentMethod;
  priority: PaymentPriority;
  intermediaryBank?: IntermediaryBank;
  routingInstructions?: {
    correspondentBanks?: IntermediaryBank[];
    specialInstructions?: string;
    regulatoryInfo?: string[];
  };
}

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
    correspondentFees?: number;
    total: number;
  };
  routing: PaymentRouting;
  status: PaymentStatus;
  reference?: string;
  purpose: string;  
  purposeCode?: string; 
  compliance: {
    screeningStatus: 'pending' | 'approved' | 'rejected' | 'review_required';
    riskScore?: number;
    amlChecks?: {
      sanctionsChecked: boolean;
      pepsChecked: boolean;
      result: 'pass' | 'fail' | 'review';
    };
    requiredDocuments?: string[];
    providedDocuments?: string[];
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  completedAt?: string;
  failureReason?: string;
}

export interface CreatePaymentRequest {
  beneficiaryId: string;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  routing: {
    method: PaymentMethod;
    priority: PaymentPriority;
  };
  reference?: string;
  purpose: string;
  purposeCode?: string;
  metadata?: Record<string, any>;
}

export interface ModifyPaymentRequest {
  id: string;
  amount?: number;
  routing?: {
    method?: PaymentMethod;
    priority?: PaymentPriority;
  };
  reference?: string;
  purpose?: string;
  purposeCode?: string;
  metadata?: Record<string, any>;
}

export interface PaymentStatusResponse {
  id: string;
  status: PaymentStatus;
  progress?: number;
  lastUpdated: string;
  estimatedCompletion?: string;
  statusMessage?: string;
  routingStatus?: {
    currentBank?: string;
    lastUpdate?: string;
    estimatedArrival?: string;
    trackingNumber?: string;
  };
}

export interface ValidatePaymentRequest {
  beneficiaryId: string;
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  routing: {
    method: PaymentMethod;
    priority: PaymentPriority;
  };
  purpose: string;
  purposeCode?: string;
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
  compliance?: {
    documentsRequired: string[];
    regulatoryInfo: string[];
    restrictions?: string[];
  };
  routing?: {
    estimatedTime: string;
    intermediaryBankRequired: boolean;
    availableMethods: PaymentMethod[];
    recommendedMethod: PaymentMethod;
  };
}
