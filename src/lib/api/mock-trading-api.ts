import { Trade, Position, TradeIntent } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockPositions: Position[] = [
  {
    id: 'p1',
    symbol: 'EUR/USD',
    currency: 'EUR',
    quantity: 825000,
    pnl: 15000,
  },
  {
    id: 'p2',
    symbol: 'GBP/USD',
    currency: 'GBP',
    quantity: 420000,
    pnl: -3000,
  },
];

const mockTrades: Trade[] = [
  {
    id: 't1',
    intent: {
      description: 'EUR/USD Split Order',
      analysis: {
        goal: 'SINGLE_EXECUTION',
        amount: 1000000,
        constraints: ['Time-sensitive', 'Minimize market impact'],
      },
    },
    execution: {
      strategy: 'TWAP',
      tranches: [
        {
          id: 'tr1',
          amount: 333000,
          rate: 1.0840,
          status: 'EXECUTED',
          executionTime: new Date(),
        },
        {
          id: 'tr2',
          amount: 333000,
          status: 'PENDING',
        },
        {
          id: 'tr3',
          amount: 334000,
          status: 'PENDING',
        },
      ],
      status: 'IN_PROGRESS',
      progress: 33,
    },
  },
];

// Mock API endpoints
class MockTradingApi {
  private validatePaymentRequest(request: any) {
    if (!request.beneficiaryDetails.accountNumber) {
      throw new Error('Invalid beneficiary account details');
    }
  }

  private getExchangeRate(source: string, target: string): number {
    return 1.2; // Mock rate
  }

  private calculatePaymentFees(request: any): number {
    return request.amount * 0.02; // 2% fee
  }

  public getPositions = async (): Promise<Position[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPositions), 500);
    });
  };

  public getActiveTrades = async (): Promise<Trade[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTrades), 500);
    });
  };

  public initiatePayment = async (
    request: any
  ): Promise<any> => {
    // Validate payment details
    await this.validatePaymentRequest(request);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      paymentId: uuidv4(),
      status: 'completed',
      confirmationCode: `PAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      details: {
        sourceAmount: request.amount,
        targetAmount: request.amount * this.getExchangeRate(request.sourceCurrency, request.targetCurrency),
        fees: this.calculatePaymentFees(request),
      },
    };
  };
}

export const tradingApi = new MockTradingApi();

// Import the API client
import api from './index';

/**
 * Test function to verify the API connection works with a provided token
 * @param text The text message to process
 * @param token The JWT token to use for authorization
 */
export async function testProcessAPI(text: string, token: string) {
  try {
    // Set the token directly on the API client
    api.setAuthToken(token);
    
    // Make the API call
    const response = await api.paymentIntents.process(text);
    
    console.log('API test successful:', response);
    return response;
  } catch (error) {
    console.error('API test failed:', error);
    throw error;
  }
}

/**
 * Example of using the function:
 * 
 * import { testProcessAPI } from '@/lib/api/mock-trading-api';
 * 
 * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE4NzUzNTUsImlhdCI6MTc0MTc4ODk1NSwic3ViIjoyfQ.uRjSwYbpHIjntDnXrC00zeE_j4h3uC_EHlUCAkhxE_4';
 * const result = await testProcessAPI('buy 100 eur', token);
 */
