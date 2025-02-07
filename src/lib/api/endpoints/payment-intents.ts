import { ApiClient } from '../client';
import { auth } from '@/lib/auth';
import {
  PaymentIntent,
  CreatePaymentIntentRequest,
  ConfirmPaymentIntentRequest,
  PaymentIntentValidation,
  ProcessedPaymentIntent
} from '@/types/api/payment-intent';

export class PaymentIntentsApi {
  constructor(private client: ApiClient) { }

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

  async process(text: string): Promise<ProcessedPaymentIntent> {
    const token = auth.getToken();
    console.log('PaymentIntentsApi.process - Starting request with text:', text);
    console.log('PaymentIntentsApi.process - Using auth token:', token ? 'Present' : 'Missing');

    try {
      const response = await this.client.post('/api/v1/payment-intents/process',
        { text },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      console.log('PaymentIntentsApi.process - Response:', response);
      
      if (response.status >= 400) {
        throw new Error(response.data.error || 'Failed to process payment intent');
      }
      
      return response;
    } catch (error: any) {
      console.error('PaymentIntentsApi.process - Error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
}
