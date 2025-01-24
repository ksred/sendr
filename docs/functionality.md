# Sendr Functionality Specification

## Core Functionality Modules

### 1. Authentication & User Management
- JWT-based auth with refresh token rotation
- Session management in Redis
- User states:
  - Logged out
  - Logged in (active)
  - Logged in (idle)
  - In trade
- User preferences persist in PostgreSQL
- Real-time session syncing across devices

### 2. Chat System
- Message Types:
  ```typescript
  type MessageType = 
    | 'USER_INPUT'        // Plain text from user
    | 'SYSTEM_MESSAGE'    // System notifications
    | 'LLM_RESPONSE'      // AI responses
    | 'TRADE_UPDATE'      // Trade status changes
    | 'RATE_ALERT'        // Price notifications
    | 'ACTION_PROMPT'     // Interactive elements
  ```

- Message Components:
  ```typescript
  interface ChatMessage {
    id: string;
    type: MessageType;
    content: string;
    timestamp: Date;
    metadata: {
      tradeId?: string;
      rateSnapshot?: number;
      actions?: ActionButton[];
      attachments?: Attachment[];
      status: 'SENT' | 'DELIVERED' | 'READ';
      error?: ErrorDetails;
    };
  }
  ```

- Interactive Elements:
  ```typescript
  interface ActionButton {
    id: string;
    label: string;
    action: 'TRADE' | 'CONFIRM' | 'CANCEL' | 'VIEW_DETAILS';
    style: 'PRIMARY' | 'SECONDARY' | 'DANGER';
    disabled?: boolean;
    loading?: boolean;
  }
  ```

### 3. Trading Flow Engine
- State Machine for Trade Process:
  ```typescript
  type TradeState =
    | 'INIT'              // Starting state
    | 'PAIR_SELECTION'    // Choosing currencies
    | 'DIRECTION_SELECT'  // Buy/Sell decision
    | 'AMOUNT_INPUT'      // Quantity specification
    | 'RATE_CONFIRM'      // Price confirmation
    | 'FINAL_REVIEW'      // Summary review
    | 'PROCESSING'        // Execution
    | 'COMPLETED'         // Success
    | 'FAILED'           // Error state
  ```

- Validation Rules:
  ```typescript
  interface ValidationRule {
    field: string;
    rule: (value: any) => boolean;
    errorMessage: string;
    severity: 'WARNING' | 'ERROR';
  }
  ```

### 4. Rate Management
- Real-time rate streaming
- Rate refresh intervals:
  - Active trade: 100ms
  - Watchlist: 1s
  - Background: 5s
- Historical rate caching
- Rate alerts system

### 5. Balance & Transaction Management
```typescript
interface Balance {
  currency: string;
  available: number;
  held: number;
  total: number;
  lastUpdated: Date;
}

interface Transaction {
  id: string;
  type: 'TRADE' | 'DEPOSIT' | 'WITHDRAWAL';
  status: TransactionStatus;
  amount: number;
  currency: string;
  timestamp: Date;
  relatedTrades?: string[];
  metadata: Record<string, any>;
}
```

## User Interface States

### 1. Main Chat View
- Components:
  - Message list (virtualized)
  - Input bar
  - Action buttons
  - Rate ticker
  - Balance display

- States:
  ```typescript
  interface ChatUIState {
    loading: boolean;
    error: Error | null;
    messages: ChatMessage[];
    activeTradeId: string | null;
    showRatePanel: boolean;
    inputDisabled: boolean;
    selectedCurrency: string | null;
  }
  ```

### 2. Trade Flow
- Steps:
  1. Currency Pair Selection
     - Popular pairs list
     - Search functionality
     - Recent pairs
     - Favourite pairs

  2. Trade Direction
     - Buy/Sell options
     - Current rate display
     - Rate trend indicator
     - Available balance

  3. Amount Input
     - Numeric input
     - Slider control
     - Quick amount buttons
     - Maximum available
     - Equivalent value display

  4. Confirmation
     - Rate refresh
     - Final amount
     - Fees calculation
     - Total cost
     - Terms acceptance

### 3. Error Handling
```typescript
interface ErrorState {
  code: string;
  message: string;
  recovery?: {
    type: 'RETRY' | 'FALLBACK' | 'MANUAL';
    action: () => void;
  };
  userMessage: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
```

## Data Management

### 1. Local Storage Structure
```typescript
interface LocalState {
  user: {
    preferences: UserPreferences;
    recentSearches: string[];
    favouritePairs: string[];
    lastViewedTrades: string[];
  };
  cache: {
    rates: Record<string, RateCache>;
    messages: Record<string, ChatMessage>;
    trades: Record<string, TradeCache>;
  };
  ui: {
    theme: 'light' | 'dark';
    fontSize: number;
    notifications: NotificationSettings;
  };
}
```

### 2. State Management
- React Query for server state
- Zustand for UI state
- Local storage for preferences
- WebSocket for real-time updates

### 3. Caching Strategy
- Rate caching: 5-minute sliding window
- Message history: 100 most recent
- Trade details: 24-hour cache
- User preferences: Indefinite with version control

## Event System

### 1. WebSocket Events
```typescript
type WebSocketEvent =
  | { type: 'RATE_UPDATE'; payload: RateUpdate }
  | { type: 'TRADE_STATUS'; payload: TradeStatus }
  | { type: 'BALANCE_UPDATE'; payload: BalanceUpdate }
  | { type: 'SYSTEM_NOTIFICATION'; payload: Notification }
```

### 2. User Actions
```typescript
type UserAction =
  | { type: 'START_TRADE'; payload: TradePair }
  | { type: 'CONFIRM_AMOUNT'; payload: TradeAmount }
  | { type: 'CANCEL_TRADE'; payload: TradeId }
  | { type: 'SEND_MESSAGE'; payload: MessageContent }
```

## LLM Integration

### 1. Context Management
```typescript
interface LLMContext {
  userHistory: TradeHistory;
  currentState: TradeState;
  availableActions: Action[];
  marketConditions: MarketData;
  userPreferences: UserPreferences;
}
```

### 2. Response Templates
- Standard responses
- Error handling
- Clarification requests
- Confirmation messages
- Educational content

### 3. Action Triggers
- Market condition alerts
- User guidance
- Error explanation
- Trade suggestions
- Risk warnings

## Performance Optimizations

### 1. Loading States
- Skeleton screens for:
  - Message history
  - Rate panels
  - Trade forms
  - Balance updates

### 2. Lazy Loading
- Message history pagination
- Dynamic component imports
- Image optimization
- Font subsetting

### 3. Caching Strategy
- Rate data caching
- Message history
- User preferences
- Trade templates
