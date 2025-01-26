# Brand Identity: "Sendr"
- Primary colours: Deep navy (#1E293B), Electric blue (#3B82F6), Mint accent (#34D399)
- Secondary: White (#FFFFFF), Light grey (#F1F5F9)
- Typography: 
  - Headings: Inter (clean, professional)
  - Body: SF Pro Display (exceptional readability)
- Design philosophy: Minimalist yet powerful, focusing on clarity and confidence

Layout Structure:

```
+----------------------------------------+
|  Account Overview Panel (h-32)          |
+----------------------------------------+
|                                        |
|           Main Content Area            |
|          - Execution Panel             |
|          - Active Orders               |
|          - Market Overview             |
|                                        |
|                                        |
|                                        |
+----------------------------------------+
|        Bottom Navigation               |
+----------------------------------------+
```

Detailed Components:

1. Account Overview Panel
   - Available trading balance
   - Position summaries by currency
   - Trading limits indicator
   - Quick position overview

2. Smart Execution Panel
   - Natural language input area
   - Trading templates section
   - Recent executions
   - Suggested approaches based on intent

3. Active Orders Panel
   - Order status tracking
   - Tranche execution status
   - Order modification options
   - Execution progress

4. Market Overview
   - Key currency pair rates
   - Rate change indicators
   - Market depth information
   - Liquidity indicators

Example Trade Flow:

```
1. User Intent Capture:
   [Natural Language Input Box]
   "I need to buy €500k for end of month supplier payments"

2. System Analysis:
   - Goal: Scheduled EUR purchase
   - Amount: €500,000
   - Timeframe: End of month
   - Type: Commercial payment

3. Execution Strategy:
   [Strategy Card]
   - Suggested approach
   - Market context
   - Risk considerations
   - Alternative approaches

4. Order Management:
   [Order Progress]
   - Execution status
   - Tranche details
   - Rate achievements
   - Completion tracking
```

Mock Data Structure:

```typescript
interface Trade {
  id: string;
  intent: {
    description: string;
    analysis: {
      goal: TradeGoal;
      amount: number;
      deadline?: Date;
      constraints: TradeConstraints[];
    };
  };
  execution: {
    strategy: ExecutionStrategy;
    tranches: TradeTranche[];
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    progress: number;
  };
  monitoring: {
    marketConditions: MarketConditions;
    alerts: Alert[];
    rateAchievement: RateAchievement;
  };
}

interface TradeTranche {
  id: string;
  amount: number;
  targetRate?: number;
  executionType: 'MARKET' | 'LIMIT';
  status: TrancheStatus;
  executionTime?: Date;
  achievedRate?: number;
}

interface MarketConditions {
  liquidityScore: number;
  volatilityLevel: string;
  depthAnalysis: DepthAnalysis;
  rateContext: RateContext;
}
```

Key Features:
1. Natural language trade construction
2. Intelligent execution splitting
3. Market-aware order management
4. Position monitoring and alerting
5. Smart templates for common scenarios
6. Risk-aware execution strategies
7. Progress tracking
8. Rate achievement analysis

Animations and Microinteractions:
- Smooth panel transitions
- Progress indicators for execution
- Rate change animations
- Order status updates
- Position changes
- Alert notifications
- Loading states for analysis

This design focuses on making forex trading more intuitive through natural language understanding while maintaining professional execution capabilities and clear position management.