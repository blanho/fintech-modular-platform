# Architecture Overview

## System Design

The FinTech Platform is a **modular monolith** built on .NET 9 with a React frontend. It follows Domain-Driven Design (DDD) principles with Clean Architecture layers, connected through MediatR (CQRS) and MassTransit (async messaging).

```
┌──────────────────────────────────────────────────────┐
│                     Frontend (SPA)                    │
│          React 19 · MUI 7 · Zustand · TanStack       │
│                   Served via Nginx                    │
└────────────────────────┬─────────────────────────────┘
                         │ /api/v1/*
┌────────────────────────▼─────────────────────────────┐
│                   FinTech.Api Host                    │
│       ASP.NET Core 9 · JWT Auth · Swagger            │
│   Middleware: Correlation, Exception, Idempotency     │
├──────────────────────────────────────────────────────┤
│  Identity │ Wallet │ Transaction │ Ledger │ Notif.   │
│  Audit    │ Report │ BackgroundJob                    │
│              (8 modules, 4 layers each)               │
├──────────────────────────────────────────────────────┤
│              BuildingBlocks (5 shared libs)           │
│   Domain · Application · Infrastructure · EventBus   │
│                     Observability                     │
└──┬──────────┬───────────────┬────────────────────────┘
   │          │               │
   ▼          ▼               ▼
PostgreSQL  Redis         RabbitMQ
  16-alpine  7-alpine     3.13-mgmt
 (8 schemas) (cache)      (events)
```

## Key Architecture Decisions

### Modular Monolith over Microservices
- **Why**: Simpler deployment, no distributed transactions, easier debugging while maintaining module isolation.
- **Boundary**: Each module owns its database schema, communicates via integration events (MassTransit/RabbitMQ).
- **Extraction path**: Any module can be promoted to a standalone service — its `.Api` project already has independent controllers, and messaging is already async.

### Clean Architecture (per module)
Each module has 4 layers with strict dependency direction:

```
Api → Application → Domain ← Infrastructure
```

| Layer | Responsibility | Dependencies |
|-------|---------------|--------------|
| **Domain** | Entities, value objects, domain events, repository interfaces | None (pure) |
| **Application** | Commands, queries, handlers (CQRS via MediatR), validation | Domain |
| **Infrastructure** | EF Core, repositories, external services, consumers | Domain, Application |
| **Api** | Controllers, DTOs, route definitions | Application |

### CQRS via MediatR
- **Commands** mutate state (Create, Update, Delete)
- **Queries** read state (Get, List)
- **Pipeline behaviors** execute cross-cutting concerns:
  1. `AuditBehavior` — logs all commands to audit trail
  2. `LoggingBehavior` — structured logging with timing
  3. `ValidationBehavior` — FluentValidation before handler execution

### Event-Driven Communication
Modules communicate asynchronously via MassTransit + RabbitMQ:

```
Transaction completed → TransactionCompletedIntegrationEvent
    → NotificationModule (sends email)
    → AuditModule (writes audit log)
    → LedgerModule (creates ledger entries)
```

**9 integration events**: `UserCreated`, `UserPasswordChanged`, `WalletCreated`, `BalanceChanged`, `TransactionCompleted`, `TransactionFailed`, `SendEmail`, `SendPushNotification`, `AuditRequested`

### Immutable Ledger
The Ledger module enforces an **append-only** pattern. A PostgreSQL trigger prevents any UPDATE or DELETE on `ledger.entries`. Corrections are handled by creating reversal entries — this is a critical financial audit requirement.

## Technology Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | .NET | 9.0 |
| Web Framework | ASP.NET Core | 9.0 |
| ORM | Entity Framework Core | 8.0.1 |
| Database | PostgreSQL | 16 (Alpine) |
| Cache | Redis (via StackExchange) | 7 (Alpine) |
| Messaging | RabbitMQ (via MassTransit) | 3.13 |
| CQRS | MediatR | 12.2.0 |
| Validation | FluentValidation | 11.9.0 |
| Resilience | Polly | 8.2.1 |
| Logging | Serilog | Structured JSON |
| Auth | JWT Bearer (HMAC-SHA256) | — |
| API Docs | Swagger / OpenAPI | v1 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.2.4 |
| Build Tool | Vite | 8.0.0 |
| Language | TypeScript (strict) | 5.9.3 |
| UI Library | MUI (Material UI) | 7.3.9 |
| State Management | Zustand | 5.0.11 |
| Server State | TanStack React Query | 5.90.21 |
| HTTP Client | Axios | 1.13.6 |
| Routing | React Router DOM | 7.13.1 |
| Forms | React Hook Form + Zod | 7.71.2 / 4.3.6 |
| Charts | Recharts | 3.8.0 |
| Icons | Lucide React | 0.577.0 |
| Font | IBM Plex Sans | — |

## Security Model

### Authentication Flow
1. User registers/logs in → server returns `accessToken` (60 min) + `refreshToken` (7 days)
2. Frontend stores tokens in Zustand persisted store (localStorage)
3. Every request attaches `Authorization: Bearer <token>` + `X-Correlation-ID`
4. On 401 → auto-refresh via `/api/v1/auth/refresh` → retry original request
5. On refresh failure → logout + redirect to `/login`

### Authorization
- **RBAC** with 4 seeded roles: Admin, User, Auditor, Support
- **14 permissions** across 7 resource categories (users, wallets, transactions, audit, reports, system)
- Frontend uses `usePermissions()` hook and `<PermissionGate>` component for UI gating
- Backend uses `[Authorize]` attributes + custom authorization handlers

### Security Middleware Stack
1. **CorrelationIdMiddleware** — request tracing across services
2. **ExceptionHandlingMiddleware** — prevents stack trace leaks, structured error JSON
3. **IdempotencyMiddleware** — prevents duplicate mutations via `X-Idempotency-Key`
4. **AuthRateLimitingMiddleware** — brute-force protection on auth endpoints
5. **TokenBlacklistMiddleware** — revoked token enforcement
6. **Security headers** — X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
