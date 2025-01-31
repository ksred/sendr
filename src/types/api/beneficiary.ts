export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName?: string;
  country: string;
  currency: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeneficiaryRequest {
  name: string;
  accountNumber: string;
  bankCode: string;
  country: string;
  currency: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  metadata?: Record<string, any>;
}

export interface UpdateBeneficiaryRequest extends Partial<CreateBeneficiaryRequest> {
  id: string;
}

export interface ValidateBeneficiaryRequest {
  accountNumber: string;
  bankCode: string;
  country: string;
}

export interface ValidateBeneficiaryResponse {
  isValid: boolean;
  bankName?: string;
  accountHolderName?: string;
  errors?: string[];
}
