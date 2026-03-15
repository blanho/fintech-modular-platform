# API Reference

Base URL: `/api/v1`

All endpoints return JSON. Mutation endpoints require the `X-Idempotency-Key` header (auto-generated if missing). All authenticated endpoints require `Authorization: Bearer <token>`.

Every response includes `X-Correlation-ID` for request tracing.

---

## Authentication

### POST `/auth/register`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST `/auth/login`
Authenticate and receive JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "a1b2c3...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["User"],
    "permissions": ["users:read", "wallets:read", "wallets:write", ...]
  }
}
```

### POST `/auth/refresh`
Exchange a refresh token for new access + refresh tokens.

**Request:**
```json
{ "refreshToken": "a1b2c3..." }
```

**Response:** `200 OK` — same shape as login response.

### POST `/auth/logout` 🔒
Revoke the current refresh token.

**Request:**
```json
{ "refreshToken": "a1b2c3..." }
```

**Response:** `204 No Content`

---

## Users

### GET `/users/me` 🔒
Get the current user's profile.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "status": "Active",
  "roles": ["User"],
  "permissions": ["users:read", ...],
  "lastLoginAt": "2026-03-15T10:00:00Z",
  "createdAt": "2026-03-01T08:00:00Z"
}
```

### PATCH `/users/me` 🔒
Update profile fields.

**Request:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe"
}
```

### POST `/users/me/change-password` 🔒
Change the current password.

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

---

## Wallets

### POST `/wallets` 🔒
Create a new wallet.

**Headers:** `X-Idempotency-Key: <uuid>`

**Request:**
```json
{
  "name": "Main USD",
  "currency": "USD"
}
```

**Currencies:** `USD`, `EUR`, `GBP`, `BTC`, `ETH`

### GET `/wallets` 🔒
List user's wallets (paginated).

**Query params:** `page`, `pageSize`

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Main USD",
      "currency": "USD",
      "status": "Active",
      "balance": 1250.50,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "totalCount": 3,
  "page": 1,
  "pageSize": 10
}
```

### GET `/wallets/{walletId}` 🔒
Get wallet details.

### GET `/wallets/{walletId}/balance` 🔒
Get current balance.

### PATCH `/wallets/{walletId}` 🔒
Rename a wallet.

**Request:**
```json
{ "name": "Savings Account" }
```

### POST `/wallets/{walletId}/freeze` 🔒
Freeze a wallet (blocks transactions).

### POST `/wallets/{walletId}/unfreeze` 🔒
Unfreeze a wallet.

### POST `/wallets/{walletId}/close` 🔒
Close a wallet (must have zero balance).

---

## Transactions

### POST `/transactions/deposit` 🔒
Deposit funds into a wallet.

**Headers:** `X-Idempotency-Key: <uuid>`

**Request:**
```json
{
  "walletId": "uuid",
  "amount": "500.00",
  "currency": "USD",
  "description": "Wire transfer"
}
```

> **Note:** `amount` is a string to avoid floating-point precision issues.

### POST `/transactions/withdraw` 🔒
Withdraw funds from a wallet.

**Request:**
```json
{
  "walletId": "uuid",
  "amount": "200.00",
  "currency": "USD",
  "description": "ATM withdrawal"
}
```

### POST `/transactions/transfer` 🔒
Transfer between wallets.

**Request:**
```json
{
  "sourceWalletId": "uuid",
  "targetWalletId": "uuid",
  "amount": "100.00",
  "currency": "USD",
  "description": "To savings"
}
```

### GET `/transactions` 🔒
List transactions (paginated, filterable).

**Query params:** `page`, `pageSize`, `type` (Deposit/Withdrawal/Transfer), `status` (Pending/Completed/Failed/Cancelled), `walletId`, `startDate`, `endDate`

### GET `/transactions/{transactionId}` 🔒
Get transaction details.

---

## Ledger

### GET `/ledger/entries` 🔒
List ledger entries for a wallet.

**Query params:** `walletId` (required), `transactionId`, `page`, `pageSize`

### GET `/ledger/balance/{walletId}` 🔒
Get calculated balance from ledger entries.

---

## Notifications

### GET `/notifications` 🔒
List user notifications (paginated, filterable).

**Query params:** `page`, `pageSize`, `type`, `isRead`

### PUT `/notifications/{id}/read` 🔒
Mark a notification as read.

### PUT `/notifications/read-all` 🔒
Mark all notifications as read.

### GET `/notifications/preferences` 🔒
Get notification preferences.

**Response:**
```json
{
  "emailEnabled": true,
  "pushEnabled": true,
  "smsEnabled": false,
  "transactionAlerts": true,
  "securityAlerts": true,
  "marketingEnabled": false
}
```

### PUT `/notifications/preferences` 🔒
Update notification preferences.

---

## Audit

### GET `/audit/logs` 🔒 🛡️ `audit:read`
List audit log entries (paginated, filterable).

**Query params:** `userId`, `actionType`, `resourceType`, `startDate`, `endDate`, `page`, `pageSize`

**Response item:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "action": "CreateWallet",
  "actionType": "Create",
  "resourceType": "Wallet",
  "resourceId": "uuid",
  "isSuccess": true,
  "durationMs": 45,
  "ipAddress": "192.168.1.1",
  "correlationId": "uuid",
  "timestamp": "2026-03-15T10:30:00Z"
}
```

---

## Reports

### POST `/reports/generate` 🔒 🛡️ `reports:read`
Generate a new report.

**Request:**
```json
{
  "title": "March Summary",
  "type": "TransactionSummary",
  "periodStart": "2026-03-01T00:00:00Z",
  "periodEnd": "2026-03-31T23:59:59Z"
}
```

**Report types:** `TransactionSummary`, `WalletBalance`, `AuditReport`, `UserActivity`, `RevenueReport`, `ComplianceReport`

### GET `/reports/my` 🔒
List user's generated reports (paginated).

### GET `/reports/{id}` 🔒
Get report details + results.

### GET `/reports/{id}/export` 🔒 🛡️ `reports:export`
Download report file.

---

## Statistics

### GET `/statistics/dashboard` 🔒
Get dashboard statistics.

**Response:**
```json
{
  "totalTransactions": 1542,
  "totalVolume": 2500000.00,
  "activeUsers": 89,
  "activeWallets": 156,
  "successRate": 0.985,
  "averageTransactionValue": 1621.27,
  "newUsersToday": 3,
  "failedTransactions": 23,
  "transactionTrend": [
    { "timestamp": "2026-03-01T00:00:00Z", "value": 120 }
  ],
  "volumeTrend": [
    { "timestamp": "2026-03-01T00:00:00Z", "value": 185000 }
  ]
}
```

---

## Background Jobs

### GET `/jobs/{jobId}` 🔒
Get job status and progress.

### POST `/jobs/{jobId}/cancel` 🔒
Request job cancellation.

---

## Webhooks

### POST `/webhooks/payment`
Stripe payment webhook callback (no auth, verified by signature).

---

## Health Checks

### GET `/health/live`
Liveness probe — returns 200 if the process is running.

### GET `/health/ready`
Readiness probe — checks database, Redis, and RabbitMQ connectivity.

---

## Error Response Format

All errors follow a consistent structure:

```json
{
  "type": "VALIDATION_ERROR",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "errors": {
    "Email": ["Email is required"],
    "Password": ["Password must be at least 8 characters"]
  },
  "correlationId": "uuid",
  "timestamp": "2026-03-15T10:30:00Z"
}
```

### Error Types

| Type | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request fields |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Duplicate resource |
| `INSUFFICIENT_BALANCE` | 422 | Not enough funds |
| `WALLET_FROZEN` | 422 | Wallet is frozen |
| `WALLET_CLOSED` | 422 | Wallet is closed |
| `DUPLICATE_TRANSACTION` | 422 | Idempotency key already used |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

**Legend:** 🔒 = requires JWT token, 🛡️ = requires specific permission
