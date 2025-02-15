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
      const response = await this.client.post('/api/v1/payment-intents', { text }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      console.log('PaymentIntentsApi.create - Response:', response);
      if (response.status >= 400) {
        throw new Error(response.data.error || 'Failed to create payment intent');
      }
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
    return this.client.get(`/api/v1/payment-intents/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  async confirm(id: string): Promise<PaymentIntent> {
    const token = auth.getToken();
    if (!token) {
      throw new Error('Authentication token missing');
    }
    try {
      const response = await this.client.post(`/api/v1/payment-intents/${id}/confirm`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (response.status >= 400) {
        throw new Error(response.data.error || 'Failed to confirm payment intent');
      }
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
      const response = await this.client.post(`/api/v1/payment-intents/${id}/reject`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (response.status >= 400) {
        throw new Error(response.data.error || 'Failed to cancel payment intent');
      }
      return response;
    } catch (error: any) {
      console.error('PaymentIntentsApi.cancel - Error:', error);
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
    return this.client.get(`/api/v1/payment-intents/${id}/validate`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
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
    return this.client.get(`/api/v1/payment-intents/${id}/suggestions`);
  }

  // async process(text: string): Promise<ProcessedPaymentIntent> {
  //   const token = auth.getToken();
  //   console.log('PaymentIntentsApi.process - Starting request with text:', text);
  //   console.log('PaymentIntentsApi.process - Using auth token:', token ? 'Present' : 'Missing');

  //   try {
  //     const response = await this.client.post('/api/v1/payment-intents/',
  //       { text },
  //       { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
  //     );
  //     console.log('PaymentIntentsApi.process - Response:', response);

  //     if (response.status >= 400) {
  //       throw new Error(response.data.error || 'Failed to process payment intent');
  //     }

  //     return response;
  //   } catch (error: any) {
  //     console.error('PaymentIntentsApi.process - Error:', error);
  //     if (error.response?.data?.error) {
  //       throw new Error(error.response.data.error);
  //     }
  //     throw error;
  //   }
  // }
}
