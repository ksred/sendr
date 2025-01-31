import { ApiClient } from './client';
import { BeneficiariesApi } from './endpoints/beneficiaries';
import { PaymentsApi } from './endpoints/payments';
import { ExchangeApi } from './endpoints/exchange';

export class Api {
  public beneficiaries: BeneficiariesApi;
  public payments: PaymentsApi;
  public exchange: ExchangeApi;
  
  private client: ApiClient;

  constructor(baseUrl: string, apiKey?: string) {
    this.client = new ApiClient(baseUrl, apiKey);
    
    // Initialize all API endpoints
    this.beneficiaries = new BeneficiariesApi(this.client);
    this.payments = new PaymentsApi(this.client);
    this.exchange = new ExchangeApi(this.client);
  }
}

// Create and export a default instance
const api = new Api(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  process.env.NEXT_PUBLIC_API_KEY
);

export default api;
