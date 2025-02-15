import { ApiResponse, ApiError as ApiErrorType } from '@/types/api/common';
import { PaymentIntent } from '@/types/api/payment-intent';

export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    console.log('ApiClient.request - Starting request:', {
      url,
      method: options.method || 'GET',
      headers: { ...headers, Authorization: headers.Authorization ? 'Bearer [REDACTED]' : undefined },
      bodyLength: options.body ? JSON.stringify(options.body).length : 0
    });

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const responseData = await response.json();
      console.log('ApiClient.request - Raw response:', responseData);

      // If response contains an error, throw it
      if (responseData.error) {
        throw new ApiClientError(
          'API_ERROR',
          responseData.error,
          responseData
        );
      }

      // Check if response is already in the expected format
      if (responseData && typeof responseData === 'object' && !responseData.hasOwnProperty('success')) {
        // If response is not wrapped in ApiResponse format, wrap it
        console.log('ApiClient.request - Unwrapped response detected, wrapping it');
        return responseData as T;
      }

      // Handle wrapped ApiResponse format
      const data = responseData as ApiResponse<T>;
      console.log('ApiClient.request - Wrapped response:', {
        status: response.status,
        success: data.success,
        error: data.error,
        dataKeys: data.data ? Object.keys(data.data) : []
      });

      if (!response.ok || (data.success === false)) {
        console.error('ApiClient.request - Error response:', {
          status: response.status,
          error: data.error
        });
        throw new ApiClientError(
          data.error?.code || 'UNKNOWN_ERROR',
          data.error?.message || 'An unknown error occurred',
          data.error?.details
        );
      }

      return data.data || responseData as T;
    } catch (error) {
      console.error('ApiClient.request - Fetch error:', error);
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new ApiClientError(
        'NETWORK_ERROR',
        'A network error occurred',
        { originalError: error.message }
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value?.toString() || ''
      }), {})
    ).toString() : '';
    
    return this.request<T>(`${endpoint}${queryParams ? `?${queryParams}` : ''}`);
  }

  async post<T>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}
