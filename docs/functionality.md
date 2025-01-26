# Sendr Functionality Specification

## Core Functionality Modules

### 1. Authentication & User Management
- JWT-based auth with refresh token rotation
- Session management in Redis
- User states:
  - Logged out
  - Logged in (active)
  - Logged in (executing)
  - Logged in (monitoring)
- User preferences persist in PostgreSQL
- Real-time session syncing across devices

### 2. LLM Integration System
```typescript
interface LLMProcessor {
  // Intent Analysis
  analyseIntent: (input: string) => Promise<TradeIntent>;
  
  // Strategy Generation
  generateStrategy: (intent: TradeIntent, context: MarketContext) => Promise<ExecutionStrategy>;
  
  // Risk Assessment
  assessRisk: (strategy: ExecutionStrategy, marketData: MarketData) => Promise<RiskAssessment>;
  
  // Market Analysis
  analyseMarket: (pair: string, depth: MarketDepth) => Promise<MarketAnalysis>;
}

interface TradeIntent {
  goal: 'SINGLE_EXECUTION' | 'SCHEDULED' | 'OPPORTUNISTIC';
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
```

### 3. Execution Engine
- State Machine for Trade Process:
```typescript
type ExecutionState =
  | 'INTENT_ANALYSIS'    // Processing user input
  | 'STRATEGY_CREATION'  // Generating approach
  | 'RISK_ASSESSMENT'    // Evaluating risk
  | 'ORDER_SPLITTING'    // Creating tranches
  | 'EXECUTION'          // Processing orders
  | 'MONITORING'         // Tracking progress
  | 'COMPLETED'          // Finished
  | 'CANCELLED'         // Terminated
```

### 4. Market Data Management
```typescript
interface MarketDataManager {
  subscribeToRates: (pairs: string[]) => void;
  getMarketDepth: (pair: string) => Promise<MarketDepth>;
  analyseMarketConditions: (pair: string) => Promise<MarketConditions>;
  getLiquidityProfile: (pair: string) => Promise<LiquidityProfile>;
}

interface MarketDepth {
  pair: string;
  bids: PriceLevel[];
  asks: PriceLevel[];
  timestamp: Date;
  liquidityScore: number;
}
```

### 5. Position & Risk Management
```typescript
interface PositionManager {
  getCurrentPositions: () => Promise<Positions>;
  calculateExposure: (positions: Positions) => Exposure;
  monitorRiskLimits: (positions: Positions) => RiskMetrics;
  trackPositionChanges: (positions: Positions) => PositionUpdates;
}

interface Position {
  currency: string;
  amount: number;
  valuationUSD: number;
  unrealizedPnL: number;
  exposure: Exposure;
}
```

## API Endpoints

### 1. Trade Management
```typescript
// Trade Endpoints
POST   /api/v1/trades/analyse      // Analyse trade intent
POST   /api/v1/trades/execute      // Execute trade strategy
GET    /api/v1/trades/:id          // Get trade details
GET    /api/v1/trades/active       // List active trades
PATCH  /api/v1/trades/:id          // Modify trade
DELETE /api/v1/trades/:id          // Cancel trade

// Position Endpoints
GET    /api/v1/positions           // Get current positions
GET    /api/v1/positions/history   // Get position history
GET    /api/v1/positions/exposure  // Get exposure analysis

// Market Data Endpoints
GET    /api/v1/market/rates        // Get current rates
GET    /api/v1/market/depth        // Get market depth
GET    /api/v1/market/analysis     // Get market analysis
```

### 2. WebSocket Events
```typescript
interface WebSocketEvents {
  // Market Updates
  RATE_UPDATE: {
    pair: string;
    rate: number;
    timestamp: Date;
  };
  
  // Execution Updates
  TRADE_UPDATE: {
    tradeId: string;
    status: ExecutionState;
    progress: number;
  };
  
  // Position Updates
  POSITION_UPDATE: {
    currency: string;
    amount: number;
    timestamp: Date;
  };
}
```

## State Management

### 1. Client State
```typescript
interface ClientState {
  user: {
    profile: UserProfile;
    preferences: UserPreferences;
    limits: TradingLimits;
  };
  trades: {
    active: Trade[];
    history: TradeHistory;
    templates: TradeTemplate[];
  };
  market: {
    rates: RateCache;
    analysis: MarketAnalysis;
    alerts: Alert[];
  };
  ui: {
    theme: 'light' | 'dark';
    executionPanel: ExecutionPanelState;
    notifications: NotificationState;
  };
}
```

### 2. Server State
```typescript
interface ServerState {
  sessions: {
    active: Session[];
    trades: ActiveTrade[];
    subscriptions: MarketSubscription[];
  };
  cache: {
    rates: RateCache;
    depth: DepthCache;
    analysis: AnalysisCache;
  };
  monitoring: {
    systemHealth: HealthMetrics;
    executionMetrics: ExecutionMetrics;
    errorRates: ErrorMetrics;
  };
}
```

## Error Handling
```typescript
interface ErrorHandler {
  handleExecutionError: (error: ExecutionError) => ErrorResponse;
  handleMarketDataError: (error: MarketDataError) => ErrorResponse;
  handleLLMError: (error: LLMError) => ErrorResponse;
  handleWebSocketError: (error: WebSocketError) => ErrorResponse;
}

interface ErrorResponse {
  code: string;
  message: string;
  userMessage: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recovery?: RecoveryAction;
}
```

## Performance Considerations

### 1. Optimization Strategies
- Rate caching with WebSocket updates
- Efficient market depth processing
- LLM response caching for similar intents
- Position calculation optimization
- Execution engine performance tuning

### 2. Monitoring Metrics
- Response times for intent analysis
- Execution completion rates
- Market data latency
- WebSocket message rates
- Error frequencies
- System resource utilization

This specification focuses on creating a sophisticated forex trading platform with natural language understanding capabilities while maintaining high performance and reliability.