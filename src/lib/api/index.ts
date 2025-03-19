import { ApiClient } from './client';
import { BeneficiariesApi } from './endpoints/beneficiaries';
import { PaymentsApi } from './endpoints/payments';
import { ExchangeApi } from './endpoints/exchange';
import { PaymentIntentsApi } from './endpoints/payment-intents';
import { AccountsApi } from './endpoints/accounts';

export class Api {
  public beneficiaries: BeneficiariesApi;
  public payments: PaymentsApi;
  public exchange: ExchangeApi;
  public paymentIntents: PaymentIntentsApi;
  public accounts: AccountsApi;

  private client: ApiClient;

  constructor(baseUrl: string, apiKey?: string) {
    this.client = new ApiClient(baseUrl, apiKey);

    // Initialize all API endpoints
    this.beneficiaries = new BeneficiariesApi(this.client);
    this.payments = new PaymentsApi(this.client);
    this.exchange = new ExchangeApi(this.client);
    this.paymentIntents = new PaymentIntentsApi(this.client);
    this.accounts = new AccountsApi(this.client);
  }
  
  setAuthToken(token: string) {
    this.client.setAuthToken(token);
  }
}

// Create and export a default instance
export default new Api(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  process.env.NEXT_PUBLIC_API_KEY
);
