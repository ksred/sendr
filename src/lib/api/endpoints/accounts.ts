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
    
    try {
      const response = await this.client.get<Account[]>('/api/v1/accounts', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return response;
    } catch (error: any) {
      // Just rethrow the error for handling at a higher level
      throw error;
    }
  }

  /**
   * Get a specific account by ID
   */
  async get(accountId: string): Promise<Account> {
    const token = auth.getToken();
    
    try {
      const response = await this.client.get<Account>(`/api/v1/accounts/${accountId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return response;
    } catch (error: any) {
      // Just rethrow the error for handling at a higher level
      throw error;
    }
  }
}