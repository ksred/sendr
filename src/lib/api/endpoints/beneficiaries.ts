import { ApiClient } from '../client';
import { 
  Beneficiary, 
  CreateBeneficiaryRequest, 
  UpdateBeneficiaryRequest,
  ValidateBeneficiaryRequest,
  ValidateBeneficiaryResponse 
} from '@/types/api/beneficiary';
import { PaginatedResponse, FilterParams } from '@/types/api/common';

export class BeneficiariesApi {
  constructor(private client: ApiClient) {}

  async list(params?: FilterParams): Promise<PaginatedResponse<Beneficiary>> {
    return this.client.get('/beneficiaries', params);
  }

  async get(id: string): Promise<Beneficiary> {
    return this.client.get(`/beneficiaries/${id}`);
  }

  async create(data: CreateBeneficiaryRequest): Promise<Beneficiary> {
    return this.client.post('/beneficiaries', data);
  }

  async update(data: UpdateBeneficiaryRequest): Promise<Beneficiary> {
    return this.client.put(`/beneficiaries/${data.id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.client.delete(`/beneficiaries/${id}`);
  }

  async validate(data: ValidateBeneficiaryRequest): Promise<ValidateBeneficiaryResponse> {
    return this.client.post('/beneficiaries/validate', data);
  }
}
