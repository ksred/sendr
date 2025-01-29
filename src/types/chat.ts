import { TradeIntent, ExecutionStrategy, MarketConditions } from './trading';

export type ActionType = 
  | 'INTENT_ANALYSIS'
  | 'STRATEGY_CREATION'
  | 'RISK_ASSESSMENT'
  | 'ORDER_SPLITTING'
  | 'EXECUTION'
  | 'MONITORING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ActionData {
  type: ActionType;
  data: {
    intent?: TradeIntent;
    strategy?: ExecutionStrategy;
    marketConditions?: MarketConditions;
    progress?: number;
    error?: string;
  };
  options?: {
    confirm?: boolean;
    modify?: boolean;
    cancel?: boolean;
  };
}

export interface Message {
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
  action?: ActionData;
  status?: 'pending' | 'processing' | 'completed' | 'error';
}
