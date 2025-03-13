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
    console.log('PaymentIntentsApi.create - Starting request with data:', text);
    console.log('PaymentIntentsApi.create - Using auth token:', token ? 'Present' : 'Missing');
    try {
      const response = await this.client.post<PaymentIntent>('/api/v1/payment-intents', { text }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      console.log('PaymentIntentsApi.create - Response:', response);
      return response;
    } catch (error: any) {
      console.error('PaymentIntentsApi.create - Error:', error);
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
      console.log('PaymentIntentsApi.confirm - Confirming payment ID:', id);
      // Use the correct URL format from the specification
      const url = 'http://localhost:8080/api/v1/process/payment/' + id + '/confirm';
      const response = await this.client.post<PaymentIntent>(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('PaymentIntentsApi.confirm - Response:', response);
      return response;
    } catch (error: any) {
      console.error('PaymentIntentsApi.confirm - Error:', error);
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
      console.log('PaymentIntentsApi.reject - Rejecting payment ID:', id);
      // Use the correct URL format from the specification
      const url = 'http://localhost:8080/api/v1/process/payment/' + id + '/reject';
      const response = await this.client.post<PaymentIntent>(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('PaymentIntentsApi.reject - Response:', response);
      return response;
    } catch (error: any) {
      console.error('PaymentIntentsApi.reject - Error:', error);
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
      console.error('PaymentIntentsApi.list - Error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async process(text: string, customToken?: string): Promise<ProcessedPaymentIntent> {
    const token = customToken || auth.getToken();
    console.log('PaymentIntentsApi.process - Starting request with text:', text);
    console.log('PaymentIntentsApi.process - Using auth token:', token ? 'Present' : 'Missing');

    try {
      // Using the correct endpoint /api/v1/process as specified in your working example
      // Using full URL to match the format in the working example
      const url = 'http://localhost:8080/api/v1/process';
      const response = await this.client.post<ProcessedPaymentIntent>(url,
        { text },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      console.log('PaymentIntentsApi.process - Response:', response);

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
