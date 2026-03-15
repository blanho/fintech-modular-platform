# FinTech Modular Platform

A production-ready fintech platform built with .NET 9 and React 19, following Domain-Driven Design (DDD), Clean Architecture, and modular monolith patterns.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Architecture Overview

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Web["React SPA<br/>Port 3000"]
        Mobile["Mobile App<br/>(Future)"]
    end

    subgraph Gateway["API Gateway"]
        Nginx["nginx<br/>Reverse Proxy"]
    end

    subgraph API["Backend API"]
        Host["ASP.NET Core Host<br/>Port 8080"]
        
        subgraph Middleware["Middleware Pipeline"]
            Cors["CORS"]
            Auth["JWT Auth"]
            Correlation["Correlation ID"]
            Idempotency["Idempotency"]
            Exception["Exception Handler"]
        end
    end

    subgraph Modules["Domain Modules"]
        Identity["Identity<br/>Auth & RBAC"]
        Wallet["Wallet<br/>Accounts"]
        Transaction["Transaction<br/>Payments"]
        Ledger["Ledger<br/>Immutable Log"]
        Notification["Notification<br/>Alerts"]
        Audit["Audit<br/>Trail"]
        Report["Report<br/>Analytics"]
        BackgroundJob["BackgroundJob<br/>Async Tasks"]
    end

    subgraph Infrastructure["Infrastructure"]
        Postgres[(PostgreSQL 16<br/>Primary DB)]
        Redis[(Redis 7<br/>Cache)]
        RabbitMQ[(RabbitMQ 3.13<br/>Message Broker)]
    end

    Web --> Nginx
    Mobile --> Nginx
    Nginx --> Host
    Host --> Middleware
    Middleware --> Modules
    
    Identity --> Postgres
    Wallet --> Postgres
    Transaction --> Postgres
    Ledger --> Postgres
    Notification --> Postgres
    Audit --> Postgres
    Report --> Postgres
    BackgroundJob --> Postgres
    
    Modules --> Redis
    Modules --> RabbitMQ
    
    Transaction -.->|Events| Ledger
    Transaction -.->|Events| Notification
    Wallet -.->|Events| Audit
```

---

## Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant N as nginx
    participant M as Middleware
    participant H as Handler
    participant D as Domain
    participant DB as PostgreSQL
    participant R as Redis
    participant Q as RabbitMQ

    C->>N: POST /api/v1/transactions/deposit
    N->>M: Forward Request
    
    Note over M: CORS → JWT Auth → Correlation ID → Idempotency
    
    M->>M: Validate JWT Token
    M->>R: Check Idempotency Key
    R-->>M: Not Found (New Request)
    
    M->>H: CreateDepositCommand
    
    Note over H: MediatR Pipeline
    H->>H: ValidationBehavior
    H->>H: LoggingBehavior
    
    H->>D: Transaction.Create()
    D->>D: Raise Domain Event
    
    H->>DB: Save Transaction
    DB-->>H: Success
    
    H->>R: Cache Idempotency Key
    
    H->>Q: Publish TransactionCreatedEvent
    
    H-->>M: Result<TransactionId>
    M-->>N: 201 Created + JSON
    N-->>C: Response

    Note over Q: Async Processing
    Q->>Ledger: Create Ledger Entry
    Q->>Notification: Send Alert
    Q->>Audit: Log Action
```

---

## Module Architecture

Each module follows Clean Architecture with 4 layers:

```mermaid
graph TB
    subgraph Module["Module (e.g., Wallet)"]
        subgraph Presentation["Presentation"]
            Controller["WalletsController"]
        end
        
        subgraph Application["Application"]
            Commands["Commands<br/>CreateWallet<br/>FreezeWallet"]
            Queries["Queries<br/>GetWallet<br/>GetBalance"]
            Handlers["Handlers"]
            Validators["Validators"]
        end
        
        subgraph Domain["Domain"]
            Entities["Entities<br/>Wallet"]
            ValueObjects["Value Objects<br/>Currency, Money"]
            Events["Domain Events<br/>WalletCreated"]
            Interfaces["Interfaces<br/>IWalletRepository"]
        end
        
        subgraph Infra["Infrastructure"]
            DbContext["WalletDbContext"]
            Repositories["WalletRepository"]
            Consumers["Event Consumers"]
        end
    end

    Controller --> Commands
    Controller --> Queries
    Commands --> Handlers
    Queries --> Handlers
    Handlers --> Validators
    Handlers --> Entities
    Handlers --> Interfaces
    Infra --> Interfaces
    Repositories --> DbContext
    
    style Domain fill:#e1f5fe
    style Application fill:#fff3e0
    style Presentation fill:#f3e5f5
    style Infra fill:#e8f5e9
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth API
    participant DB as Database
    participant R as Redis

    Note over U,R: Registration
    U->>F: Fill Registration Form
    F->>A: POST /auth/register
    A->>A: Hash Password (BCrypt)
    A->>DB: Create User + Assign Role
    A-->>F: 201 Created

    Note over U,R: Login
    U->>F: Enter Credentials
    F->>A: POST /auth/login
    A->>DB: Validate Credentials
    A->>A: Generate JWT (60min)
    A->>A: Generate Refresh Token (7d)
    A->>DB: Store Refresh Token
    A-->>F: {accessToken, refreshToken, user}
    F->>F: Store in Zustand

    Note over U,R: Authenticated Request
    F->>A: GET /wallets (Bearer Token)
    A->>A: Validate JWT
    A->>R: Check Token Blacklist
    A-->>F: 200 OK + Data

    Note over U,R: Token Refresh
    F->>A: POST /auth/refresh
    A->>DB: Validate Refresh Token
    A->>A: Generate New Tokens
    A->>DB: Revoke Old, Store New
    A-->>F: New Tokens
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph Internet["Internet"]
        Users["Users"]
    end

    subgraph Docker["Docker Compose"]
        subgraph Frontend["Frontend Service"]
            Nginx["nginx:alpine<br/>:3000 → :80"]
            React["React Build<br/>Static Files"]
        end

        subgraph Backend["Backend Service"]
            API["ASP.NET Core<br/>:8080"]
        end

        subgraph Data["Data Services"]
            PG["PostgreSQL 16<br/>:5432"]
            RD["Redis 7<br/>:6379"]
            RMQ["RabbitMQ 3.13<br/>:5672 / :15672"]
        end

        subgraph Admin["Admin Tools"]
            PGA["pgAdmin<br/>:5050"]
            RDC["Redis Commander<br/>:8081"]
        end
    end

    subgraph Volumes["Persistent Volumes"]
        PGV["postgres_data"]
        RDV["redis_data"]
        RMQV["rabbitmq_data"]
    end

    Users --> Nginx
    Nginx --> React
    Nginx -->|/api/*| API
    
    API --> PG
    API --> RD
    API --> RMQ
    
    PGA --> PG
    RDC --> RD
    
    PG --> PGV
    RD --> RDV
    RMQ --> RMQV

    style Frontend fill:#61dafb22
    style Backend fill:#512bd422
    style Data fill:#4169e122
```

---

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    USERS ||--o{ WALLETS : owns
    USERS ||--o{ REFRESH_TOKENS : has
    ROLES ||--o{ USER_ROLES : assigned
    ROLES ||--o{ PERMISSIONS : contains
    WALLETS ||--o{ TRANSACTIONS : source
    WALLETS ||--o{ LEDGER_ENTRIES : records
    TRANSACTIONS ||--o{ LEDGER_ENTRIES : creates
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AUDIT_LOGS : generates
    USERS ||--o{ REPORTS : requests

    USERS {
        uuid id PK
        string email UK
        string password_hash
        int status
        string first_name
        string last_name
        timestamp last_login_at
    }

    ROLES {
        uuid id PK
        string name UK
        int type
        bool is_system
    }

    PERMISSIONS {
        uuid id PK
        string name
        uuid role_id FK
    }

    WALLETS {
        uuid id PK
        uuid user_id FK
        string currency
        int status
        string name
    }

    TRANSACTIONS {
        uuid id PK
        int type
        int status
        decimal amount
        string currency
        uuid source_wallet_id FK
        uuid target_wallet_id FK
        string idempotency_key UK
    }

    LEDGER_ENTRIES {
        uuid id PK
        uuid wallet_id FK
        decimal amount
        uuid reference_id FK
        int entry_type
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        int type
        string title
        text body
        int status
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string resource_type
        string resource_id
        bool is_success
    }
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19, TypeScript 5.9, Vite 8 | SPA Framework |
| | MUI 7, Zustand, TanStack Query | UI, State, Data Fetching |
| **Backend** | .NET 9, ASP.NET Core | API Framework |
| | MediatR, FluentValidation | CQRS, Validation |
| | MassTransit | Message Bus |
| | EF Core 9 | ORM |
| **Database** | PostgreSQL 16 | Primary Storage |
| | Redis 7 | Caching, Idempotency |
| | RabbitMQ 3.13 | Event Messaging |
| **Infrastructure** | Docker Compose | Container Orchestration |
| | nginx | Reverse Proxy |

---

## Quick Start

### Prerequisites

- Docker Desktop 4.x
- .NET SDK 9.0
- Node.js 22.x
- Git

### 1. Clone & Start Infrastructure

```bash
git clone <repository-url>
cd fintech-modular-platform

cd infrastructure/docker
docker compose up -d
```

### 2. Run Backend

```bash
cd src/Backend/Host/FinTech.Api
dotnet run
```

Backend available at: http://localhost:5152/swagger

### 3. Run Frontend

```bash
cd src/Frontend
npm install
npm run dev
```

Frontend available at: http://localhost:3000

### 4. (Alternative) Full Docker Stack

```bash
cd infrastructure/docker
docker compose --profile app up -d --build
```

---

## Project Structure

```
fintech-modular-platform/
├── docs/                             # Developer documentation
├── infrastructure/
│   └── docker/                       # Docker Compose + init scripts
├── src/
│   ├── Backend/
│   │   ├── Host/FinTech.Api/         # ASP.NET Core host
│   │   ├── Modules/                  # Domain modules (8)
│   │   │   ├── Identity/
│   │   │   ├── Wallet/
│   │   │   ├── Transaction/
│   │   │   ├── Ledger/
│   │   │   ├── Notification/
│   │   │   ├── Audit/
│   │   │   ├── Report/
│   │   │   └── BackgroundJob/
│   │   └── Shared/                   # Shared kernel + infrastructure
│   └── Frontend/                     # React SPA
└── tests/                            # Unit, Integration, Architecture tests
```

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Getting Started](docs/getting-started.md) | Setup & first API calls |
| [Architecture](docs/architecture.md) | Design decisions & patterns |
| [API Reference](docs/api-reference.md) | All endpoints & contracts |
| [Development Guide](docs/development-guide.md) | Adding features & coding standards |
| [Frontend Guide](docs/frontend-guide.md) | React patterns & design system |
| [Deployment](docs/deployment.md) | Docker & production setup |
| [Database](docs/database.md) | Schema reference & queries |

---

## API Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `POST /api/v1/auth/register` | Create account |
| Auth | `POST /api/v1/auth/login` | Get JWT tokens |
| Auth | `POST /api/v1/auth/refresh` | Refresh tokens |
| Wallets | `POST /api/v1/wallets` | Create wallet |
| Wallets | `GET /api/v1/wallets/{id}` | Get wallet |
| Transactions | `POST /api/v1/transactions/deposit` | Deposit funds |
| Transactions | `POST /api/v1/transactions/withdraw` | Withdraw funds |
| Transactions | `POST /api/v1/transactions/transfer` | Transfer between wallets |
| Ledger | `GET /api/v1/ledger/entries` | Get ledger entries |
| Reports | `POST /api/v1/reports/generate` | Generate report |

See [API Reference](docs/api-reference.md) for complete documentation.

---

## Testing

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test tests/Backend/Unit/FinTech.Tests.Unit/

# Frontend type check
cd src/Frontend && npm run build
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with .NET 9 + React 19
</p>
