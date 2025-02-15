import { ApiClient } from '../client';
import { auth } from '@/lib/auth';
import {
  APIPaymentIntent,
  APICreatePaymentIntentRequest,
  APIConfirmPaymentIntentRequest,
  APIPaymentIntentValidation
} from '@/types/api/payment-intent';

interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}

interface ApiErrorResponse {
  error: string;
  status: number;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class PaymentIntentsApi {
  constructor(private client: ApiClient) { }

  async create(text: string): Promise<APIPaymentIntent> {
    const token = auth.getToken();
    console.log('PaymentIntentsApi.create - Starting request with data:', text);
    console.log('PaymentIntentsApi.create - Using auth token:', token ? 'Present' : 'Missing');
    try {
      const response = await this.client.post<ApiResponse<APIPaymentIntent>>('/api/v1/payment-intents', { text }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      console.log('PaymentIntentsApi.create - Response:', response);
      if ('error' in response) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error: any) {
      console.error('PaymentIntentsApi.create - Error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to create payment intent');
    }
  }

  async confirm(id: string, data: APIConfirmPaymentIntentRequest): Promise<APIPaymentIntent> {
    const token = auth.getToken();
    try {
      const response = await this.client.post<ApiResponse<APIPaymentIntent>>(`/api/v1/payment-intents/${id}/confirm`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if ('error' in response) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to confirm payment intent');
    }
  }

  async reject(id: string): Promise<APIPaymentIntent> {
    const token = auth.getToken();
    try {
      const response = await this.client.post<ApiResponse<APIPaymentIntent>>(`/api/v1/payment-intents/${id}/reject`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if ('error' in response) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to reject payment intent');
    }
  }

  async get(id: string): Promise<APIPaymentIntent> {
    const token = auth.getToken();
    try {
      const response = await this.client.get<ApiResponse<APIPaymentIntent>>(`/api/v1/payment-intents/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if ('error' in response) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to get payment intent');
    }
  }

  async validate(text: string): Promise<APIPaymentIntentValidation> {
    const token = auth.getToken();
    try {
      const response = await this.client.post<ApiResponse<APIPaymentIntentValidation>>('/api/v1/payment-intents/validate', { text }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if ('error' in response) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to validate payment intent');
    }
  }

  async getSuggestions(): Promise<APIPaymentIntent[]> {
    const token = auth.getToken();
    try {
      const response = await this.client.get<ApiResponse<APIPaymentIntent[]>>('/api/v1/payment-intents/suggestions', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if ('error' in response) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to get payment suggestions');
    }
  }
}
