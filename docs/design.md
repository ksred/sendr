Brand Identity: "Sendr"
- Primary colours: Deep navy (#1E293B), Electric blue (#3B82F6), Mint accent (#34D399)
- Secondary: White (#FFFFFF), Light grey (#F1F5F9)
- Typography: 
  - Headings: Inter (clean, professional)
  - Body: SF Pro Display (exceptional readability)
- Design philosophy: Minimalist yet powerful, focusing on clarity and confidence

Layout Structure:

```
+----------------------------------------+
|  Nav (h-16)                            |
+----------------------------------------+
|          |                             |
| Sidebar  |        Main Chat Area       |
| (w-64)   |                            |
|          |                             |
|          |                             |
|          |                             |
|          |                             |
|          |  [Floating Action Buttons]  |
|          |                             |
|          |     [Message History]       |
|          |                             |
|          |     [Input Area]           |
+----------+-----------------------------+
```

Detailed Components:

1. Navigation Bar
   - Logo (FlowTrade with animated flowing line underneath)
   - Account balance prominently displayed
   - Profile dropdown with:
     - User settings
     - Notification centre
     - Language selection
     - Dark/light mode toggle

2. Sidebar
   - Trading pairs watchlist
   - Quick market rates
   - Recent transactions
   - Collapsible for more chat space

3. Floating Action Buttons
   - Pill-shaped buttons with subtle hover animations
   - Icons + text for clarity
   - Dynamic positioning based on chat context
   - Buttons:
     ```
     [💰 Balance] [📊 Transactions] [💱 New Trade] [ℹ️ Details]
     ```

4. Chat Interface
   - Message bubbles:
     - User: Right-aligned, navy background
     - System: Left-aligned, grey background
     - LLM: Left-aligned, gradient background
   - Typing indicators with subtle animation
   - Time stamps in relative format
   - Read receipts
   - Progressive loading with skeleton states

5. Input Area
   - Modern floating input bar
   - Send button with animation
   - File attachment support
   - Smart suggestions based on context

Example Trade Flow:

```
User: [Clicks "New Trade" button]

System: "Welcome to FlowTrade! Let's help you make a forex trade. What currencies would you like to trade?"

[Quick select buttons appear]
[EUR/USD] [GBP/USD] [USD/JPY] [Custom Pair]

User: "I want to trade EUR/USD"

System: "Great choice! Current rate for EUR/USD is 1.0823
Would you like to:
[ Buy EUR ] [ Sell EUR ]"

User: [Clicks Buy EUR]

System: "How many EUR would you like to buy?
Current balance: $50,000 USD
Maximum purchasable: 46,198.28 EUR"

[Numeric input field appears with slider]

...continues with validation and confirmation
```

Mock Data Structure:

```typescript
interface Trade {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  amount: number;
  rate: number;
  type: 'BUY' | 'SELL';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  timestamp: Date;
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  balances: {
    [currency: string]: number;
  };
  recentTrades: Trade[];
}

interface Message {
  id: string;
  content: string;
  type: 'USER' | 'SYSTEM' | 'LLM';
  timestamp: Date;
  metadata?: {
    tradeId?: string;
    action?: string;
    buttons?: Array<{
      label: string;
      action: string;
    }>;
  };
}
```

Key Features:
1. Real-time rate updates via WebSocket
2. Animated transitions between states
3. Progressive form filling
4. Context-aware suggestions
5. Error prevention vs error recovery
6. Clear confirmation steps
7. Transaction summaries
8. Rate alerts

Animations and Microinteractions:
- Subtle button hover states
- Loading states with shimmer effects
- Message appear/disappear animations
- Smooth scrolling behaviour
- Typing indicators
- Success/error state transitions

This design focuses on creating a professional yet approachable interface that makes forex trading less intimidating while maintaining the sophistication expected in financial applications.
