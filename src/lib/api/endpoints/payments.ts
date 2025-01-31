import { ApiClient } from '../client';
import {
  Payment,
  CreatePaymentRequest,
  ModifyPaymentRequest,
  PaymentStatusResponse,
  ValidatePaymentRequest,
  ValidatePaymentResponse
} from '@/types/api/payment';
import { PaginatedResponse, FilterParams } from '@/types/api/common';

export class PaymentsApi {
  constructor(private client: ApiClient) {}

  async list(params?: FilterParams): Promise<PaginatedResponse<Payment>> {
    return this.client.get('/payments', params);
  }

  async get(id: string): Promise<Payment> {
    return this.client.get(`/payments/${id}`);
  }

  async create(data: CreatePaymentRequest): Promise<Payment> {
    return this.client.post('/payments', {
      ...data,
      idempotencyKey: crypto.randomUUID(), // Add idempotency key for safety
    });
  }

  async modify(data: ModifyPaymentRequest): Promise<Payment> {
    return this.client.put(`/payments/${data.id}/modify`, data);
  }

  async cancel(id: string): Promise<Payment> {
    return this.client.put(`/payments/${id}/cancel`);
  }

  async getStatus(id: string): Promise<PaymentStatusResponse> {
    return this.client.get(`/payments/${id}/status`);
  }

  async validate(data: ValidatePaymentRequest): Promise<ValidatePaymentResponse> {
    return this.client.post('/payments/validate', data);
  }

  // Compliance check before payment
  async checkCompliance(id: string): Promise<{
    approved: boolean;
    requiresReview: boolean;
    reasons?: string[];
  }> {
    return this.client.get(`/payments/${id}/compliance`);
  }

  // Get payment receipt/confirmation
  async getReceipt(id: string): Promise<{
    receiptUrl: string;
    reference: string;
    timestamp: string;
  }> {
    return this.client.get(`/payments/${id}/receipt`);
  }
}
