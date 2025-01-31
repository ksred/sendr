export interface ExchangeRate {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  inverse: number;
  spread: number;
  timestamp: string;
  expiresAt: string;
}

export interface ExchangeRateCalculation {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  targetAmount: number;
  rate: number;
  fees: {
    exchangeFee: number;
    networkFee: number;
    processingFee: number;
    total: number;
  };
  totalPayable: number;
}

export interface ExchangeRateHistoryPoint {
  rate: number;
  timestamp: string;
  volume?: number;
}

export interface ExchangeRateHistory {
  sourceCurrency: string;
  targetCurrency: string;
  interval: '1h' | '1d' | '1w' | '1m';
  data: ExchangeRateHistoryPoint[];
}

export interface FeeEstimate {
  exchangeFee: number;
  networkFee: number;
  processingFee: number;
  total: number;
  breakdown?: {
    percentage: number;
    fixed: number;
    thirdParty: number;
  };
}
