import { Trade, Position, TradeIntent } from '@/types/trading';

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
export const tradingApi = {
  getPositions: async (): Promise<Position[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPositions), 500);
    });
  },

  getActiveTrades: async (): Promise<Trade[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTrades), 500);
    });
  },

  submitTradeIntent: async (intent: TradeIntent): Promise<Trade> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrade: Trade = {
          id: `t${Date.now()}`,
          intent: {
            description: 'New Trade',
            analysis: {
              goal: intent.goal,
              amount: intent.constraints.amount,
              deadline: intent.constraints.deadline,
              constraints: [],
            },
          },
          execution: {
            strategy: 'TWAP',
            tranches: [
              {
                id: `tr${Date.now()}`,
                amount: intent.constraints.amount,
                status: 'PENDING',
              },
            ],
            status: 'PENDING',
            progress: 0,
          },
        };
        resolve(newTrade);
      }, 1000);
    });
  },
};
