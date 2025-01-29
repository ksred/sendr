export type TradeGoal = 'SINGLE_EXECUTION' | 'SCHEDULED' | 'OPPORTUNISTIC';
export type ExecutionState = 
  | 'INTENT_ANALYSIS'
  | 'STRATEGY_CREATION'
  | 'RISK_ASSESSMENT'
  | 'ORDER_SPLITTING'
  | 'EXECUTION'
  | 'MONITORING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TradeIntent {
  goal: TradeGoal;
  constraints: {
    amount: number;
    deadline?: Date;
    targetRate?: number;
    riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  context: {
    marketConditions: MarketConditions;
    userHistory: UserHistory;
    positionContext: PositionContext;
  };
}

export interface MarketConditions {
  volatility: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  liquidity: number;
}

export interface UserHistory {
  recentTrades: Trade[];
  preferredPairs: string[];
  riskProfile: string;
}

export interface PositionContext {
  currentPositions: Position[];
  exposureLimit: number;
  utilizationRate: number;
}

export interface Position {
  id: string;
  symbol: string;
  currency: string;
  quantity: number;
  pnl: number;
}

export interface Trade {
  id: string;
  intent: {
    description: string;
    analysis: {
      goal: TradeGoal;
      amount: number;
      deadline?: Date;
      constraints: string[];
    };
  };
  execution: {
    strategy: string;
    tranches: TradeTranche[];
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    progress: number;
  };
}

export interface TradeTranche {
  id: string;
  amount: number;
  rate?: number;
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
  executionTime?: Date;
}
