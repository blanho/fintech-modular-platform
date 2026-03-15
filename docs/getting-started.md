# Getting Started

This guide walks you through setting up the FinTech Platform on your local machine from scratch.

## Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| **Docker Desktop** | 4.x | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |
| **.NET SDK** | 9.0 | [dot.net/download](https://dot.net/download) |
| **Node.js** | 22 LTS | [nodejs.org](https://nodejs.org/) |
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) |

Verify your setup:

```bash
docker --version        # Docker version 27.x+
dotnet --version        # 9.0.x
node --version          # v22.x
npm --version           # 10.x+
git --version           # git version 2.x
```

## 1. Clone the Repository

```bash
git clone <repository-url> fintech-modular-platform
cd fintech-modular-platform
```

## 2. Start Infrastructure

The platform depends on PostgreSQL, Redis, and RabbitMQ. Docker Compose provides all three plus management UIs:

```bash
cd infrastructure/docker
cp .env.example .env          # create local env config
docker compose up -d           # start infra services
```

Wait for all services to be healthy:

```bash
docker compose ps
```

You should see:

| Service | Port | Status |
|---------|------|--------|
| fintech-postgres | 5432 | healthy |
| fintech-redis | 6379 | healthy |
| fintech-rabbitmq | 5672 / 15672 | healthy |
| fintech-pgadmin | 5050 | running |
| fintech-redis-commander | 8081 | running |

> The init-db.sql script automatically creates all 8 schemas, tables, indexes, and seeds the role/permission data on first run.

## 3. Run the Backend API

```bash
# from project root
dotnet build FinTech.sln
dotnet run --project src/Host/FinTech.Api
```

The API starts at **http://localhost:5152** (HTTP) or **https://localhost:7278** (HTTPS).

Verify it's running:

```bash
curl http://localhost:5152/health/live
# {"status":"Healthy","checks":[],...}

curl http://localhost:5152/health/ready
# {"status":"Healthy","checks":[{"name":"database",...},{"name":"cache",...},{"name":"messaging",...}],...}
```

Open Swagger UI at: **http://localhost:5152/swagger**

## 4. Run the Frontend

```bash
cd src/Frontend
npm install               # install dependencies
npm run dev               # start Vite dev server
```

The frontend runs at **http://localhost:3000** with hot module replacement.

> The Vite dev server proxies `/api/*` requests to `http://localhost:8080`. If you're running the backend via `dotnet run` on port 5152, update the proxy target in `vite.config.ts` or use the Docker `--profile app` approach below.

## 5. Your First API Call

### Register a user

```bash
curl -X POST http://localhost:5152/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@fintech.com",
    "password": "SecurePass123!",
    "firstName": "Dev",
    "lastName": "User"
  }'
```

### Log in

```bash
curl -X POST http://localhost:5152/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@fintech.com",
    "password": "SecurePass123!"
  }'
```

Response includes `accessToken` and `refreshToken`. Use the access token for subsequent requests:

```bash
export TOKEN="<your-access-token>"

# Get your profile
curl http://localhost:5152/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"

# Create a wallet
curl -X POST http://localhost:5152/api/v1/wallets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: $(uuidgen)" \
  -d '{ "name": "Main USD", "currency": "USD" }'
```

## 6. Alternative: Full-Stack Docker

Run everything (infra + backend + frontend) with a single command:

```bash
cd infrastructure/docker
docker compose --profile app up -d --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger |
| pgAdmin | http://localhost:5050 |
| RabbitMQ Management | http://localhost:15672 |
| Redis Commander | http://localhost:8081 |

### Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| PostgreSQL | fintech | fintech_dev_password |
| pgAdmin | admin@fintech.local | admin |
| RabbitMQ | fintech | fintech_dev_password |

## 7. IDE Setup

### Visual Studio / Rider (.NET)
- Open `FinTech.sln` at the project root
- Set `FinTech.Api` as the startup project
- Launch profiles are preconfigured in `Properties/launchSettings.json`

### VS Code
- Open the root folder
- Recommended extensions: C# Dev Kit, ESLint, Prettier, REST Client
- The frontend uses `@/` path alias — TypeScript language features resolve this automatically via `tsconfig.json`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `dotnet build` fails with missing SDK | Install .NET 9 SDK from dot.net/download |
| Database connection refused | Run `docker compose up -d` in `infrastructure/docker/` |
| Port 5432 already in use | Change `POSTGRES_PORT` in `.env` or stop the local PostgreSQL |
| Frontend shows network errors | Check that the backend is running and the proxy target port matches |
| Redis connection refused | Ensure Redis container is running: `docker compose ps redis` |
| `npm install` fails | Delete `node_modules` and `package-lock.json`, then retry |
