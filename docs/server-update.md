# Sendr Implementation Plan

## System Overview

Sendr is a natural language payment processing system that integrates with Datasoft's API for executing payments. The system provides a user-friendly interface for initiating payments through natural language commands while ensuring proper approval workflows and compliance checks.

## Core Components

### 1. Natural Language Processing
- **Purpose**: Convert natural language payment requests into structured payment intents
- **Components**:
  - Intent Parser (processes raw input)
  - Entity Extractor (identifies beneficiaries, amounts, dates)
  - Validation Engine (confirms extracted data)
  - Suggestion Generator (provides alternatives for ambiguous inputs)

### 2. Payment Processing
- **Purpose**: Manage the lifecycle of payments from intent to execution
- **Components**:
  - Payment Manager (orchestrates payment flow)
  - Approval Workflow Engine
  - Datasoft Integration Service
  - Status Tracking System

### 3. User Management
- **Purpose**: Handle user authentication and authorization
- **Components**:
  - Authentication Service
  - Authorization Manager
  - Profile Manager
  - Session Handler

### 4. Beneficiary Management
- **Purpose**: Manage and validate payment recipients
- **Components**:
  - Beneficiary Cache
  - Validation Service
  - Matching Engine (for NLP)
  - Sync Service (with Datasoft)

## Application Structure

```
sendr-backend/
├── cmd/                    # Application entry points
│   └── api/               # API server
│       └── main.go        # Main API server entry point
├── internal/              # Private application code
│   ├── api/              # API layer
│   │   ├── handlers/     # HTTP request handlers
│   │   ├── middleware/   # HTTP middleware
│   │   └── routes/       # Route definitions
│   ├── auth/             # Authentication package
│   │   ├── jwt/         # JWT implementation
│   │   └── oauth/       # OAuth providers
│   ├── config/           # Configuration management
│   ├── datasoft/         # Datasoft API integration
│   │   ├── client/      # API client
│   │   ├── models/      # Datasoft specific models
│   │   └── mock/        # Mock client for testing
│   ├── db/               # Database layer
│   │   ├── migrations/  # Database migrations
│   │   └── models/      # GORM models
│   ├── nlp/              # Natural Language Processing
│   │   ├── intent/      # Intent parsing
│   │   ├── entity/      # Entity extraction
│   │   └── matcher/     # Beneficiary matching
│   ├── payment/          # Payment processing
│   │   ├── approval/    # Approval workflow
│   │   ├── processor/   # Payment execution
│   │   └── validator/   # Payment validation
│   └── service/          # Business logic layer
│       ├── user/        # User service
│       ├── payment/     # Payment service
│       └── beneficiary/ # Beneficiary service
├── pkg/                  # Public libraries
│   ├── currency/         # Currency handling
│   ├── logger/          # Logging utilities
│   └── validator/       # Validation helpers
├── scripts/              # Build and deployment scripts
├── test/                 # Integration and e2e tests
│   ├── integration/     # Integration tests
│   └── e2e/            # End-to-end tests
└── web/                 # Web assets and templates
```

### Layer Responsibilities

1. **API Layer** (`internal/api/`)
   - HTTP request handling
   - Request validation
   - Response formatting
   - Authentication middleware
   - Rate limiting
   - CORS handling

2. **Service Layer** (`internal/service/`)
   - Business logic implementation
   - Transaction management
   - Event handling
   - Service-to-service communication
   - Caching strategies

3. **Database Layer** (`internal/db/`)
   - GORM model definitions
   - Database migrations
   - Query builders
   - Database transactions
   - Connection management

4. **NLP Layer** (`internal/nlp/`)
   - Intent parsing logic
   - Entity extraction
   - Beneficiary matching
   - Natural language generation
   - Training data management

5. **Datasoft Integration** (`internal/datasoft/`)
   - API client implementation
   - Request/response mapping
   - Rate limiting
   - Error handling
   - Retry logic

### Key Design Patterns

1. **Dependency Injection**
   ```go
   type PaymentService struct {
       db          *gorm.DB
       datasoftClient datasoft.Client
       nlpService  nlp.Service
       logger      *logger.Logger
   }
   ```

2. **Repository Pattern**
   ```go
   type PaymentRepository interface {
       Create(ctx context.Context, payment *models.Payment) error
       FindByID(ctx context.Context, id string) (*models.Payment, error)
       Update(ctx context.Context, payment *models.Payment) error
       Delete(ctx context.Context, id string) error
   }
   ```

3. **Service Interface**
   ```go
   type PaymentService interface {
       CreatePaymentIntent(ctx context.Context, input string) (*models.Payment, error)
       ApprovePayment(ctx context.Context, id string, approver string) error
       ExecutePayment(ctx context.Context, id string) error
   }
   ```

4. **Middleware Chain**
   ```go
   router.Use(
       middleware.RequestID,
       middleware.RealIP,
       middleware.Logger,
       middleware.Recoverer,
       middleware.Authentication,
   )
   ```

### Configuration Management

```go
type Config struct {
    Server struct {
        Port     int
        Host     string
        TimeoutSeconds int
    }
    Database struct {
        Host     string
        Port     int
        Name     string
        User     string
        Password string
        SSLMode  string
    }
    Datasoft struct {
        BaseURL  string
        APIKey   string
        Timeout  time.Duration
    }
    Auth struct {
        JWTSecret    string
        TokenExpiry  time.Duration
    }
}
```

### Error Handling

```go
type AppError struct {
    Code    string
    Message string
    Err     error
}

var (
    ErrPaymentNotFound    = AppError{Code: "PAYMENT_NOT_FOUND", Message: "Payment not found"}
    ErrInvalidAmount      = AppError{Code: "INVALID_AMOUNT", Message: "Invalid payment amount"}
    ErrUnauthorized       = AppError{Code: "UNAUTHORIZED", Message: "Unauthorized access"}
    ErrInvalidBeneficiary = AppError{Code: "INVALID_BENEFICIARY", Message: "Invalid beneficiary"}
)

## Database Models

### User Models
```go
type User struct {
    gorm.Model
    Email          string         `gorm:"uniqueIndex;not null"`
    HashedPassword string         `gorm:"not null"`
    Status         string         `gorm:"not null"`
    FirstName      string
    LastName       string
    LastLoginAt    *time.Time
    Settings       datatypes.JSON `gorm:"type:jsonb"`
    Preferences    UserPreferences
}

type UserPreferences struct {
    gorm.Model
    UserID                string         `gorm:"uniqueIndex"`
    DefaultCurrency      string         `gorm:"size:3"`
    NotificationPrefs    datatypes.JSON `gorm:"type:jsonb"`
}
```

### Payment Models
```go
type Payment struct {
    gorm.Model
    UserID          string         `gorm:"index"`
    Status          string         `gorm:"not null"`
    ApprovalStatus  string         `gorm:"not null"`
    RawInput        string         `gorm:"type:text;not null"`
    ParsedIntent    datatypes.JSON `gorm:"type:jsonb;not null"`
    BeneficiaryRef  datatypes.JSON `gorm:"type:jsonb;not null"`
    AmountValue     decimal.Decimal `gorm:"type:decimal(20,8);not null"`
    AmountCurrency  string         `gorm:"size:3;not null"`
    Purpose         string
    SubmittedAt     *time.Time
    ApprovedAt      *time.Time
    ApprovedBy      *string
    RejectedAt      *time.Time
    RejectedBy      *string
    RejectionReason string
    DataSoftID      string
    DataSoftStatus  string
    Version         int            `gorm:"not null;default:1"`
    Events          []PaymentEvent
}

type PaymentEvent struct {
    gorm.Model
    PaymentID   string         `gorm:"index"`
    EventType   string         `gorm:"not null"`
    EventData   datatypes.JSON `gorm:"type:jsonb;not null"`
    CreatedBy   string
}
```

### Beneficiary Models
```go
type BeneficiaryCache struct {
    gorm.Model
    DataSoftID     string         `gorm:"uniqueIndex;not null"`
    UserID         string         `gorm:"index"`
    Name           string         `gorm:"not null"`
    AccountDetails datatypes.JSON `gorm:"type:jsonb;not null"`
    Status         string         `gorm:"not null"`
    LastUsedAt     *time.Time
    Metadata       datatypes.JSON `gorm:"type:jsonb"`
    Aliases        []BeneficiaryAlias
}

type BeneficiaryAlias struct {
    gorm.Model
    BeneficiaryCacheID string    `gorm:"index"`
    Alias              string    `gorm:"not null"`
}
```

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/session
```

### Payments
```
POST /api/payments/intent           # Create payment intent from natural language
GET  /api/payments                  # List payments
GET  /api/payments/:id              # Get payment details
POST /api/payments/:id/approve      # Approve payment
POST /api/payments/:id/reject       # Reject payment
GET  /api/payments/:id/status       # Get payment status
```

### Beneficiaries
```
GET  /api/beneficiaries            # List beneficiaries
GET  /api/beneficiaries/:id        # Get beneficiary details
POST /api/beneficiaries/sync       # Sync with Datasoft
```

## Implementation Phases

### Phase 1: Core Infrastructure
1. Set up project structure
2. Implement database migrations
3. Create basic user authentication
4. Set up Datasoft API integration layer

### Phase 2: Payment Foundation
1. Implement payment model and database schema
2. Create basic payment CRUD operations
3. Implement approval workflow
4. Set up payment status tracking

### Phase 3: Natural Language Processing
1. Implement intent parsing
2. Create beneficiary matching
3. Add amount and currency extraction
4. Implement validation rules

### Phase 4: Datasoft Integration
1. Implement beneficiary sync
2. Add payment execution
3. Set up status synchronization
4. Implement error handling

### Phase 5: User Experience
1. Add user preferences
2. Implement notification system
3. Create payment history views
4. Add payment templates

## Security Considerations

1. **Authentication**
   - JWT-based authentication
   - Secure password hashing
   - Rate limiting on auth endpoints
   - Session management

2. **Data Protection**
   - Encryption at rest for sensitive data
   - TLS for all API communications
   - Secure handling of Datasoft credentials
   - Regular security audits

3. **Access Control**
   - Role-based access control
   - Payment approval limits
   - IP whitelisting for admin functions
   - Audit logging

## Monitoring and Observability

1. **Logging**
   - Payment lifecycle events
   - Authentication events
   - API integration events
   - Error tracking

2. **Metrics**
   - Payment success/failure rates
   - API latency
   - NLP accuracy
   - System health metrics

3. **Alerting**
   - Payment failures
   - API integration issues
   - Security events
   - System health issues

## Testing Strategy

1. **Unit Tests**
   - Core business logic
   - NLP components
   - Data validation
   - Model behavior

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Datasoft integration
   - Payment workflows

3. **End-to-End Tests**
   - Complete payment flows
   - User journeys
   - Error scenarios
   - Performance testing

## Deployment Strategy

1. **Environments**
   - Development
   - Staging
   - Production

2. **CI/CD**
   - Automated testing
   - Code quality checks
   - Security scanning
   - Automated deployment

3. **Infrastructure**
   - Containerized deployment
   - Auto-scaling
   - Database backups
   - Monitoring setup
