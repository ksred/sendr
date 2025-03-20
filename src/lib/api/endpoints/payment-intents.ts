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

  async create(text: string): Promise<PaymentIntent> {
    const token = auth.getToken();
    try {
      const response = await this.client.post<PaymentIntent>('/api/v1/payment-intents', { text }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return response;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async get(id: string): Promise<PaymentIntent> {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Authentication token missing');
    }
    return this.client.get<PaymentIntent>(`/api/v1/payment-intents/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async confirm(id: string): Promise<PaymentIntent> {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Authentication token missing');
    }
    try {
      // Use relative path - the client will add the base URL
      const url = '/api/v1/process/payment/' + id + '/confirm';
      const response = await this.client.post<PaymentIntent>(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async reject(id: string): Promise<PaymentIntent> {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Authentication token missing');
    }
    try {
      // Use relative path - the client will add the base URL
      const url = '/api/v1/process/payment/' + id + '/reject';
      const response = await this.client.post<PaymentIntent>(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async validate(id: string): Promise<PaymentIntentValidation> {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Authentication token missing');
    }
    return this.client.get<PaymentIntentValidation>(`/api/v1/payment-intents/${id}/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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
    return this.client.get<{
      alternatives: Array<{
        field: string;
        currentValue: any;
        suggestedValue: any;
        reason: string;
      }>;
    }>(`/api/v1/payment-intents/${id}/suggestions`);
  }

  async list(): Promise<PaymentIntent[]> {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Authentication token missing');
    }
    try {
      const response = await this.client.get<PaymentIntent[]>('/api/v1/payment-intents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async process(text: string, customToken?: string): Promise<ProcessedPaymentIntent> {
    const token = customToken || auth.getToken();

    try {
      // Using the correct endpoint /api/v1/process with relative path
      // Let the client handle the base URL
      const url = '/api/v1/process';
      const response = await this.client.post<ProcessedPaymentIntent>(url,
        { text },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      return response;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
}
