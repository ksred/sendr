# Sendr API Specification

This document outlines the API endpoints and functionality required for the Sendr cross-border payment application backend.

## Core Endpoints

### Authentication
- `POST /api/auth/login`
  - Authenticate user and return JWT token
  - Required fields: `email`, `password`

- `POST /api/auth/refresh`
  - Refresh JWT token
  - Required: Valid refresh token in Authorization header

### Account Management
- `GET /api/account`
  - Get account overview including balances and settings
  - Response includes: `balances`, `currencies`, `paymentLimits`

- `GET /api/account/transactions`
  - Get transaction history
  - Optional query params: `status`, `timeframe`

- `GET /api/account/payees`
  - Get saved payee information
  - Optional query params: `country`, `currency`

### Payments
- `POST /api/payments/direct-purchase`
  - Buy currency directly into account
  - Required fields: `sourceCurrency`, `targetCurrency`, `amount`
  - Returns: Payment details including fees and exchange rate

- `POST /api/payments/to-payee`
  - Send payment to a payee in their currency
  - Required fields: `payeeId`, `amount`, `sourceCurrency`, `targetCurrency`
  - Returns: Payment details including fees and exchange rate

- `GET /api/payments/status/:id`
  - Get status of payment
  - Returns: Current status, progress, and payment details

- `POST /api/payments/cancel/:id`
  - Cancel a pending payment
  - Only applicable for payments not yet processed

### Exchange Rates
- `GET /api/exchange/rate/:sourceCurrency/:targetCurrency`
  - Get real-time exchange rate
  - Returns: Current rate, spread, fees

- `GET /api/exchange/history/:sourceCurrency/:targetCurrency`
  - Get historical exchange rates
  - Query params: `timeframe`, `interval`

### Payee Management
- `POST /api/payees`
  - Add new payee
  - Required fields: `name`, `country`, `currency`, `accountDetails`

- `GET /api/payees`
  - List all payees
  - Optional query params: `country`, `currency`

- `GET /api/payees/:id`
  - Get specific payee details

- `PUT /api/payees/:id`
  - Update payee information

- `DELETE /api/payees/:id`
  - Remove payee

## Data Models

### Payment Types
```typescript
type PaymentType = 
  | 'DIRECT_PURCHASE'
  | 'PAYMENT_TO_PAYEE';

type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

interface Payment {
  id: string;
  type: PaymentType;
  status: PaymentStatus;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  targetAmount: number;
  exchangeRate: number;
  fees: {
    exchangeFee: number;
    transferFee: number;
    totalFee: number;
  };
  payee?: PayeeInformation;
  timestamp: string;
  completedAt?: string;
}

interface PayeeInformation {
  id: string;
  name: string;
  country: string;
  currency: string;
  accountDetails: {
    accountNumber: string;
    bankCode?: string;
    swiftCode?: string;
    iban?: string;
  };
  paymentHistory?: Payment[];
}

interface ExchangeRate {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  spread: number;
  timestamp: string;
  fees: {
    percentage: number;
    fixed: number;
  };
}
```

## Authentication & Security
- All endpoints except `/api/auth/login` require JWT authentication
- Tokens expire after 1 hour
- Rate limiting applied to all endpoints
- CORS configuration required for frontend integration

## Error Handling
All endpoints follow a standard error response format:
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

Common error codes:
- `AUTH_ERROR`: Authentication failed
- `INVALID_REQUEST`: Invalid request parameters
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `EXECUTION_ERROR`: Payment execution error
- `MARKET_ERROR`: Market data error
