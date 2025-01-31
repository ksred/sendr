export interface BankDetails {
  bankName: string;
  bankCode: string;       // National bank code
  swiftBic: string;      // SWIFT/BIC code
  routingNumber?: string; // ABA/ACH routing number for US
  sortCode?: string;      // UK sort code
  branchCode?: string;    // Branch identifier
  bankAddress?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface Beneficiary {
  id: string;
  name: string;
  type: 'individual' | 'business';
  accountNumber: string;  // Basic account number
  iban?: string;         // International Bank Account Number
  bankDetails: BankDetails;
  country: string;
  currency: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  taxId?: string;        // Tax ID/SSN/EIN
  metadata?: Record<string, any>;
  status: 'active' | 'inactive' | 'pending_verification';
  verificationStatus?: {
    verified: boolean;
    requiredDocuments?: string[];
    completedDocuments?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeneficiaryRequest {
  name: string;
  type: 'individual' | 'business';
  accountNumber: string;
  iban?: string;
  bankDetails: {
    bankName: string;
    bankCode: string;
    swiftBic: string;
    routingNumber?: string;
    sortCode?: string;
    branchCode?: string;
    bankAddress?: {
      street: string;
      city: string;
      country: string;
      postalCode: string;
    };
  };
  country: string;
  currency: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  taxId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateBeneficiaryRequest extends Partial<CreateBeneficiaryRequest> {
  id: string;
}

export interface ValidateBeneficiaryRequest {
  accountNumber?: string;
  iban?: string;
  bankDetails: {
    bankCode: string;
    swiftBic: string;
    routingNumber?: string;
    sortCode?: string;
  };
  country: string;
}

export interface ValidateBeneficiaryResponse {
  isValid: boolean;
  bankName?: string;
  accountHolderName?: string;
  validationChecks: {
    ibanValid?: boolean;
    swiftBicValid: boolean;
    bankCodeValid: boolean;
    accountNumberValid?: boolean;
    routingNumberValid?: boolean;
    sortCodeValid?: boolean;
  };
  errors?: string[];
  warnings?: string[];
  additionalInfo?: {
    intermediaryBankRequired?: boolean;
    documentationRequired?: string[];
    regulatoryInfo?: string[];
  };
}
