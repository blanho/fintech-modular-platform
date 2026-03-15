# 🐳 FinTech Platform — Docker Infrastructure

## Quick Start

```bash
# Start infrastructure only (PostgreSQL, Redis, RabbitMQ)
docker compose up -d

# Start everything including the API
docker compose --profile app up -d --build

# Stop all
docker compose down

# Stop and remove all data
docker compose down -v
```

## Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **API** | http://localhost:8080 | JWT Bearer |
| **Swagger** | http://localhost:8080/swagger | — |
| **Health Check** | http://localhost:8080/health/ready | — |
| **PostgreSQL** | localhost:5432 | fintech / fintech_dev_password |
| **pgAdmin** | http://localhost:5050 | admin@fintech.local / admin |
| **Redis** | localhost:6379 | — |
| **Redis Commander** | http://localhost:8081 | — |
| **RabbitMQ Management** | http://localhost:15672 | fintech / fintech_dev_password |

## Local Development (Infra Only)

Run infrastructure containers, then start the API from your IDE:

```bash
cd infrastructure/docker
docker compose up -d postgres redis rabbitmq

# Then in project root:
dotnet run --project src/Host/FinTech.Api
```

## Database Schemas

The `init-db.sql` creates 8 schemas matching the modular monolith boundaries:

| Schema | Module | Tables |
|--------|--------|--------|
| `identity` | Identity | users, roles, permissions, user_roles, refresh_tokens |
| `wallet` | Wallet | wallets |
| `ledger` | Ledger | entries (immutable) |
| `transaction` | Transaction | transactions |
| `notification` | Notification | notifications, notification_preferences |
| `audit` | Audit | audit_logs |
| `background_job` | BackgroundJob | jobs |
| `report` | Report | reports, statistics_snapshots |

## pgAdmin Setup

1. Open http://localhost:5050
2. Add New Server:
   - **Name**: FinTech Local
   - **Host**: `postgres` (Docker network name)
   - **Port**: `5432`
   - **Database**: `fintech`
   - **Username**: `fintech`
   - **Password**: `fintech_dev_password`

## Environment Variables

Copy `.env` and customize values as needed. All variables have sensible defaults.

## Architecture

```
┌─────────────┐     ┌──────────┐     ┌───────────┐
│   API :8080 │────▶│ Postgres │     │   Redis   │
│  (.NET 9)   │     │  :5432   │     │   :6379   │
└──────┬──────┘     └──────────┘     └───────────┘
       │
       │            ┌───────────┐
       └───────────▶│ RabbitMQ  │
                    │   :5672   │
                    └───────────┘
```
