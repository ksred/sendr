# Sendr API Intent Response Formats

This document details the response formats for various intents processed through the `/api/v1/process` endpoint.

## Common Response Structure

All responses from the `/api/v1/process` endpoint follow this general structure:

```json
{
  "intent_type": "the_intent_type",
  "confidence": 0.0-1.0,
  "result": {} // Intent-specific result object
}
```

- `intent_type`: The classified intent type (string)
- `confidence`: The confidence score of the intent classification (float between 0.0 and 1.0)
- `result`: The intent-specific result object (structure varies by intent type)

## Intent-Specific Response Formats

### Payment Intent

**Intent Type:** `payment`

**Example:**
```json
{
  "confidence": 0.95,
  "intent_type": "payment",
  "result": {
    "amount": "100.00",
    "currency": "USD",
    "beneficiary_name": "John Doe",
    "purpose": "Monthly rent",
    "exchange_rate": "1.0",
    "fee": "0.00",
    "confidence": {
      "amount": 0.98,
      "currency": 0.95,
      "beneficiary": 0.92
    }
  }
}
```

### Scheduled Payment Intent

**Intent Type:** `schedule_payment`

**Example:**
```json
{
  "confidence": 0.92,
  "intent_type": "schedule_payment",
  "result": {
    "amount": "200.00",
    "currency": "USD",
    "beneficiary_name": "Jane Smith",
    "purpose": "Utilities bill",
    "schedule_date": "2025-04-01T00:00:00Z",
    "is_recurring": true,
    "frequency": "monthly",
    "confidence": {
      "amount": 0.95,
      "currency": 0.90,
      "beneficiary": 0.85,
      "schedule_date": 0.92
    }
  }
}
```

### Show Beneficiary Intent

**Intent Type:** `show_beneficiary`

**Example:**
```json
{
  "intent_type": "show_beneficiary",
  "confidence": 0.95,
  "result": [
    {
      "beneficiary": {
        "id": 1,
        "name": "Jane Smith",
        "bank_info": "Bank of America - 7890",
        "currency": "USD"
      },
      "confidence": 0.85
    },
    {
      "beneficiary": {
        "id": 3,
        "name": "John Smith",
        "bank_info": "Chase - 1234",
        "currency": "USD"
      },
      "confidence": 0.75
    }
  ]
}
```

### Create Beneficiary Intent

**Intent Type:** `create_beneficiary`

**Example:**
```json
{
  "intent_type": "create_beneficiary",
  "confidence": 0.97,
  "result": {
    "id": "abcdef12-3456-7890-abcd-ef1234567890",
    "name": "Mike Johnson",
    "bank_name": "Wells Fargo",
    "account_number": "1234567890",
    "bank_code": "WFBIUS6S",
    "currency": "USD",
    "description": "Friend's account for monthly payments",
    "created_at": "2025-03-12T19:30:00Z",
    "updated_at": "2025-03-12T19:30:00Z"
  }
}
```

### List Transactions Intent

**Intent Type:** `list_transactions`

**Example:**
```json
{
  "confidence": 0.91,
  "intent_type": "list_transactions",
  "result": {
    "start_date": "2025-03-01T00:00:00Z",
    "end_date": "2025-03-12T23:59:59Z",
    "min_amount": "50.00",
    "max_amount": null,
    "transactions": [
      {
        "id": "txn_123456789",
        "date": "2025-03-10T15:30:00Z",
        "amount": "150.00",
        "currency": "USD",
        "beneficiary": "John Doe",
        "type": "payment",
        "status": "completed"
      },
      {
        "id": "txn_987654321",
        "date": "2025-03-05T12:45:00Z",
        "amount": "75.50",
        "currency": "USD",
        "beneficiary": "Electric Company",
        "type": "payment",
        "status": "completed"
      }
    ],
    "confidence": {
      "date_range": 0.85,
      "amount_range": 0.80
    }
  }
}
```

### Buy Foreign Currency Intent

**Intent Type:** `buy_foreign_currency`

**Example:**
```json
{
  "confidence": 0.96,
  "intent_type": "buy_foreign_currency",
  "result": {
    "amount": "100",
    "from_currency": "EUR",
    "to_currency": "EUR",
    "rate": "1",
    "converted_amount": "100",
    "fee": "0",
    "total_cost": "100",
    "confidence": {
      "amount": 0.9,
      "from_currency": 0.9,
      "to_currency": 0
    }
  }
}
```

## Error Response Format

When an error occurs, the API returns a JSON object with an error message:

```json
{
  "error": "Descriptive error message"
}
```

Common error scenarios:
- Invalid input format
- Beneficiary not found
- Insufficient account balance
- System error processing the request
- Authentication/authorization failures

## HTTP Status Codes

- `200 OK`: Request processed successfully
- `400 Bad Request`: Invalid input or parameters
- `401 Unauthorized`: Authentication failure
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error