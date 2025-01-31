import { ApiClient } from '../client';
import {
  ExchangeRate,
  ExchangeRateCalculation,
  ExchangeRateHistory,
  FeeEstimate
} from '@/types/api/exchange';

export interface ExchangeCalculateParams {
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
  type: 'source' | 'target';
}

export interface ExchangeHistoryParams {
  sourceCurrency: string;
  targetCurrency: string;
  interval: '1h' | '1d' | '1w' | '1m';
  from: string;
  to: string;
}

export class ExchangeApi {
  constructor(private client: ApiClient) {}

  // Get current exchange rate for a currency pair
  async getRate(sourceCurrency: string, targetCurrency: string): Promise<ExchangeRate> {
    return this.client.get('/exchange-rates', {
      sourceCurrency,
      targetCurrency,
    });
  }

  // Get multiple exchange rates at once
  async getRates(pairs: string[]): Promise<Record<string, ExchangeRate>> {
    return this.client.get('/exchange-rates/bulk', {
      pairs: pairs.join(','),
    });
  }

  // Calculate exchange amount including fees
  async calculate(params: ExchangeCalculateParams): Promise<ExchangeRateCalculation> {
    return this.client.get('/exchange-rates/calculate', params);
  }

  // Get exchange rate history for a currency pair
  async getHistory(params: ExchangeHistoryParams): Promise<ExchangeRateHistory> {
    return this.client.get('/exchange-rates/history', params);
  }

  // Get fee estimate for a potential transaction
  async estimateFees(params: ExchangeCalculateParams): Promise<FeeEstimate> {
    return this.client.get('/fees/estimate', params);
  }

  // Subscribe to real-time rate updates (returns WebSocket URL)
  async subscribeToRates(pairs: string[]): Promise<{
    websocketUrl: string;
    subscriptionKey: string;
  }> {
    return this.client.post('/exchange-rates/subscribe', {
      pairs,
    });
  }
}
