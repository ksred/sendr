export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
  spread: number;
}

export interface ExchangeRates {
  [currencyPair: string]: ExchangeRate;
}

export interface ExchangeRateHistory {
  currencyPair: string;
  rates: Array<{
    rate: number;
    timestamp: Date;
    volume?: number;
  }>;
  period: string;
}

export interface FeeStructure {
  baseFee: number;
  feePercentage: number;
  minimumFee: number;
  estimatedTotal: number;
  breakdown: {
    exchangeFee: number;
    networkFee: number;
    processingFee: number;
  };
}
