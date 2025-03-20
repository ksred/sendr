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
  
  // Helper method to get a formatted error message
  getFormattedMessage(): string {
    if (this.details && Object.keys(this.details).length > 0) {
      return `${this.message} (${this.code})`;
    }
    return this.message;
  }
  
  // Static method to create an error from an API error response
  static fromApiError(apiError: ApiErrorType | undefined, fallbackMessage: string = 'An unknown error occurred'): ApiClientError {
    if (!apiError) {
      return new ApiClientError('UNKNOWN_ERROR', fallbackMessage);
    }
    
    return new ApiClientError(
      apiError.code || 'API_ERROR',
      apiError.message || fallbackMessage,
      apiError.details
    );
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
  
  setAuthToken(token: string) {
    console.log('ApiClient: Setting auth token:', token.substring(0, 10) + '...');
    this.apiKey = token;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // If the endpoint already starts with http:// or https://, use it as is
    const url = endpoint.startsWith('http://') || endpoint.startsWith('https://') 
      ? endpoint 
      : `${this.baseUrl}${endpoint}`;
    
    console.log(`ApiClient: Making request to: ${url}`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Only add Authorization header if not already provided in options.headers
    if (this.apiKey && !options.headers?.Authorization) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      console.log('ApiClient: Added auth header with token');
    } else if (!this.apiKey && !options.headers?.Authorization) {
      console.warn('ApiClient: No auth token available for request to:', url);
    }

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Check for 401 Unauthorized immediately, before trying to parse the response
      if (response.status === 401) {
        console.error('Authentication error: Token expired or invalid (status 401)');
        
        // Handle in browser environments only
        if (typeof window !== 'undefined') {
          // Clear auth state
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          
          // Redirect to login - use direct window redirect for most reliable navigation
          console.log('Redirecting to login page due to authentication error');
          window.location.href = '/login?error=session_expired';
          
          // Delay to ensure the redirect has a chance to occur
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw ApiClientError.fromApiError(
          { code: 'UNAUTHORIZED', message: 'Your session has expired. Please log in again.' },
          'Authentication required'
        );
      }

      // For all other responses, process normally
      const responseData = await response.json();

      // If response contains an error, throw it
      if (responseData.error) {
        throw ApiClientError.fromApiError(
          typeof responseData.error === 'string' 
            ? { code: 'API_ERROR', message: responseData.error }
            : responseData.error,
          'API request failed'
        );
      }

      // Check if response is already in the expected format
      if (responseData && typeof responseData === 'object' && !responseData.hasOwnProperty('success')) {
        // If response is not wrapped in ApiResponse format, wrap it
        return responseData as T;
      }

      // Handle wrapped ApiResponse format
      const data = responseData as ApiResponse<T>;
      
      if (!response.ok || (data.success === false)) {
        throw ApiClientError.fromApiError(
          data.error,
          response.ok ? 'Request failed' : `HTTP error ${response.status}`
        );
      }

      return data.data || responseData as T;
    } catch (error: any) {
      // If it's already our type of error, just re-throw it
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      // For network errors (fetch failures)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new ApiClientError(
          'NETWORK_ERROR',
          'Unable to connect to the server. Please check your internet connection.',
          { originalError: error.message }
        );
      }
      
      // For JSON parsing errors
      if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        throw new ApiClientError(
          'RESPONSE_PARSE_ERROR',
          'Unable to parse server response',
          { originalError: error.message }
        );
      }
      
      // Generic fallback
      throw new ApiClientError(
        'UNKNOWN_ERROR',
        'An unexpected error occurred',
        { originalError: error.message }
      );
    }
  }

  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET'
    });
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
