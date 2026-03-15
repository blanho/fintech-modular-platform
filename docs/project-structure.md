# Project Structure

## Root Layout

```
fintech-modular-platform/
├── FinTech.sln                      # .NET solution file (38 projects)
├── Directory.Build.props            # Global build settings (net9.0, nullable)
├── .gitignore
├── .dockerignore
├── docs/                            # Developer documentation (you are here)
├── infrastructure/
│   └── docker/
│       ├── docker-compose.yml       # All services definition
│       ├── Dockerfile               # Backend multi-stage build
│       ├── Dockerfile.frontend      # Frontend multi-stage build
│       ├── nginx.conf               # Frontend reverse proxy config
│       ├── init-db.sql              # Database schema + seed data
│       ├── .env                     # Local environment variables
│       └── .env.example             # Template for .env
├── src/
│   ├── BuildingBlocks/              # Shared libraries (5 projects)
│   ├── Host/                        # API host entry point
│   ├── Modules/                     # Business modules (8 × 4 layers)
│   └── Frontend/                    # React SPA
└── tests/
    └── Backend/
        ├── Unit/
        ├── Integration/
        └── Architecture/
```

## Backend — Module Structure

Every module follows the same 4-layer Clean Architecture pattern:

```
src/Modules/{ModuleName}/
├── FinTech.Modules.{Module}.Domain/          # Pure domain layer
│   ├── Entities/                              # Aggregate roots + entities
│   ├── ValueObjects/                          # Immutable value types
│   ├── Events/                                # Domain events
│   ├── Enums/                                 # Status, type enumerations
│   ├── Repositories/                          # Repository interfaces (contracts)
│   └── Exceptions/                            # Domain-specific exceptions
│
├── FinTech.Modules.{Module}.Application/      # Use cases
│   ├── Commands/                              # Write operations (CQRS)
│   │   └── {CommandName}/
│   │       ├── {CommandName}Command.cs        # MediatR IRequest<TResponse>
│   │       ├── {CommandName}Handler.cs        # MediatR IRequestHandler
│   │       └── {CommandName}Validator.cs      # FluentValidation rules
│   ├── Queries/                               # Read operations
│   │   └── {QueryName}/
│   │       ├── {QueryName}Query.cs
│   │       ├── {QueryName}Handler.cs
│   │       └── {QueryName}Response.cs         # Query-specific DTO
│   ├── Contracts/                             # Service interfaces
│   └── Mapping/                               # Entity ↔ DTO mapping
│
├── FinTech.Modules.{Module}.Infrastructure/   # External concerns
│   ├── Persistence/
│   │   ├── {Module}DbContext.cs               # EF Core DbContext (module-scoped schema)
│   │   ├── Configurations/                    # EF fluent configurations
│   │   └── Repositories/                      # Repository implementations
│   ├── Services/                              # External service implementations
│   ├── Consumers/                             # MassTransit event consumers
│   └── {Module}ModuleRegistration.cs          # DI registration extension method
│
└── FinTech.Modules.{Module}.Api/              # HTTP surface
    └── Controllers/
        └── {Resource}Controller.cs            # [ApiController] + [Route("api/v1/{resource}")]
```

### The 8 Modules

| Module | Schema | Purpose | Key Entities |
|--------|--------|---------|-------------|
| **Identity** | `identity` | Auth, users, RBAC | User, Role, Permission, RefreshToken |
| **Wallet** | `wallet` | Wallet lifecycle | Wallet (with Balance value object) |
| **Transaction** | `transaction` | Financial operations | Transaction (Deposit/Withdraw/Transfer) |
| **Ledger** | `ledger` | Immutable audit trail | LedgerEntry (append-only) |
| **Notification** | `notification` | Multi-channel alerts | Notification, NotificationPreference |
| **Audit** | `audit` | Action logging | AuditLog |
| **BackgroundJob** | `background_job` | Async task processing | Job |
| **Report** | `report` | Analytics & exports | Report, StatisticsSnapshot |

## Backend — BuildingBlocks

Shared libraries referenced by all modules:

```
src/BuildingBlocks/
├── FinTech.BuildingBlocks.Domain/           # Entity, AggregateRoot, ValueObject, Result pattern
├── FinTech.BuildingBlocks.Application/      # LoggingBehavior, ValidationBehavior
├── FinTech.BuildingBlocks.Infrastructure/   # RedisCacheService, EF base configs
├── FinTech.BuildingBlocks.EventBus/         # IEventPublisher, MassTransitEventPublisher
└── FinTech.BuildingBlocks.Observability/    # Serilog enrichers, metrics
```

## Backend — Host

```
src/Host/FinTech.Api/
├── Program.cs                  # Composition root — wires all modules + middleware
├── appsettings.json            # Development configuration
├── appsettings.Production.json # Production overrides
├── FinTech.Api.csproj          # References all module .Api projects
├── Middleware/
│   ├── CorrelationIdMiddleware.cs    # X-Correlation-ID tracking
│   ├── ExceptionHandlingMiddleware.cs # Structured error responses
│   └── IdempotencyMiddleware.cs       # Duplicate request prevention
├── Swagger/
│   └── IdempotencyKeyOperationFilter.cs
└── Properties/
    └── launchSettings.json     # Dev server ports (5152 http, 7278 https)
```

## Frontend — Structure

```
src/Frontend/
├── package.json              # Dependencies + scripts
├── vite.config.ts            # Build config, proxy, path aliases
├── tsconfig.json             # TypeScript strict mode, @/ alias
├── eslint.config.js          # Flat ESLint config
├── index.html                # SPA entry point
└── src/
    ├── main.tsx              # React root render
    ├── vite-env.d.ts         # VITE_API_URL type declaration
    ├── app/
    │   ├── App.tsx           # Root component with providers
    │   ├── Router.tsx        # All routes (lazy-loaded)
    │   ├── providers/
    │   │   └── AppProviders.tsx  # QueryClient + MUI Theme + Router
    │   └── layouts/
    │       ├── DashboardLayout.tsx  # Main authenticated layout
    │       ├── Sidebar.tsx          # Navigation (permission-gated)
    │       └── Topbar.tsx           # User menu + notifications
    ├── features/             # Feature modules (see below)
    ├── shared/               # Cross-cutting shared code
    │   ├── api/
    │   │   └── client.ts     # Axios instance + interceptors
    │   ├── components/       # Reusable UI components
    │   ├── constants/
    │   ├── design-system/
    │   │   └── theme.ts      # MUI dark theme (215 lines)
    │   ├── hooks/
    │   │   └── usePermission.ts  # RBAC hook
    │   ├── lib/
    │   │   ├── errorMessages.ts  # API error → user message mapping
    │   │   ├── idempotency.ts    # UUID generation
    │   │   └── utils.ts
    │   ├── stores/
    │   │   ├── authStore.ts      # Zustand (persisted)
    │   │   └── sidebarStore.ts
    │   └── types/            # All TypeScript interfaces
    │       ├── api.ts        # PaginatedResponse, ApiError
    │       ├── auth.ts       # User, LoginRequest, etc.
    │       ├── wallet.ts     # Wallet, WalletStatus, Currency
    │       ├── transaction.ts # Transaction, filters, requests
    │       ├── domain.ts     # Audit, Notification, Report, etc.
    │       └── index.ts      # Barrel exports
    └── assets/
```

### Feature Module Pattern

Each feature folder mirrors the backend module:

```
features/{feature}/
├── api/
│   └── {feature}Api.ts      # Axios calls to backend endpoints
├── hooks/
│   └── use{Feature}.ts       # TanStack Query hooks (useQuery, useMutation)
├── pages/
│   ├── {Feature}Page.tsx     # List/main page
│   └── {Feature}DetailPage.tsx
├── components/               # Feature-specific components
│   └── {Feature}Dialog.tsx
└── index.ts                  # Barrel exports
```

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| C# namespace | `FinTech.Modules.{Module}.{Layer}` | `FinTech.Modules.Wallet.Domain` |
| C# class | PascalCase | `CreateWalletCommand` |
| C# interface | `I` prefix | `IWalletRepository` |
| DB schema | snake_case | `background_job` |
| DB table | snake_case plural | `audit_logs` |
| DB column | snake_case | `source_wallet_id` |
| API route | kebab-case, versioned | `api/v1/wallets/{walletId}/balance` |
| TS component | PascalCase | `WalletDetailPage.tsx` |
| TS hook | camelCase, `use` prefix | `useWallets.ts` |
| TS api file | camelCase, `Api` suffix | `walletApi.ts` |
| TS type | PascalCase | `TransactionFilters` |
| TS store | camelCase, `Store` suffix | `authStore.ts` |
