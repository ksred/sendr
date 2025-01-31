import { ApiClient } from '../client';
import {
  PaymentIntent,
  CreatePaymentIntentRequest,
  ConfirmPaymentIntentRequest,
  PaymentIntentValidation
} from '@/types/api/payment-intent';

export class PaymentIntentsApi {
  constructor(private client: ApiClient) {}

  async create(data: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    return this.client.post('/payment-intents', data);
  }

  async get(id: string): Promise<PaymentIntent> {
    return this.client.get(`/payment-intents/${id}`);
  }

  async confirm(data: ConfirmPaymentIntentRequest): Promise<PaymentIntent> {
    return this.client.post(`/payment-intents/${data.id}/confirm`, data);
  }

  async cancel(id: string): Promise<PaymentIntent> {
    return this.client.post(`/payment-intents/${id}/cancel`);
  }

  async validate(id: string): Promise<PaymentIntentValidation> {
    return this.client.get(`/payment-intents/${id}/validate`);
  }

  // Get suggested corrections or alternatives for the payment intent
  async getSuggestions(id: string): Promise<{
    alternatives: Array<{
      field: string;
      currentValue: any;
      suggestedValue: any;
      reason: string;
    }>;
  }> {
    return this.client.get(`/payment-intents/${id}/suggestions`);
  }
}
