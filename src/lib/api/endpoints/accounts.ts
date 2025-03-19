import { ApiClient } from '../client';
import { Account } from '@/types/account';
import { auth } from '@/lib/auth';

export class AccountsApi {
  constructor(private client: ApiClient) { }

  /**
   * Get all accounts for the authenticated user
   */
  async list(): Promise<Account[]> {
    const token = auth.getToken();
    console.log('AccountsApi.list - Using auth token:', token ? 'Present' : 'Missing');
    
    try {
      const response = await this.client.get<Account[]>('/api/v1/accounts', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      console.log('AccountsApi.list - Response:', response);
      return response;
    } catch (error: any) {
      console.error('AccountsApi.list - Error:', error);
      throw error;
    }
  }

  /**
   * Get a specific account by ID
   */
  async get(accountId: string): Promise<Account> {
    const token = auth.getToken();
    console.log('AccountsApi.get - Using auth token:', token ? 'Present' : 'Missing');
    
    try {
      const response = await this.client.get<Account>(`/api/v1/accounts/${accountId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return response;
    } catch (error: any) {
      console.error('AccountsApi.get - Error:', error);
      throw error;
    }
  }
}