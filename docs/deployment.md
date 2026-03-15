# Deployment Guide

Docker-based deployment for development and production environments.

---

## Docker Services

The platform runs 7 services defined in `infrastructure/docker/docker-compose.yml`:

### Infrastructure Services (default profile)

These start with a simple `docker compose up -d`:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `postgres` | postgres:16-alpine | 5432 | Primary database |
| `pgadmin` | dpage/pgadmin4 | 5050 | Database admin UI |
| `redis` | redis:7-alpine | 6379 | Caching + distributed locks |
| `redis-commander` | redis-commander | 8081 | Redis admin UI |
| `rabbitmq` | rabbitmq:3.13-management | 5672 / 15672 | Message broker + management UI |

### Application Services (`app` profile)

These require `--profile app`:

| Service | Build | Port | Purpose |
|---------|-------|------|---------|
| `api` | `Dockerfile` | 8080 | .NET 9 backend API |
| `frontend` | `Dockerfile.frontend` | 3000 | React SPA (nginx) |

---

## Running Modes

### 1. Local Development (Recommended)

Run infrastructure in Docker, apps locally for hot-reload:

```bash
cd infrastructure/docker

# Start infrastructure only
docker compose up -d

# Terminal 1 — Backend (hot-reload)
cd src/Backend/Host/FinTech.Api
dotnet watch run

# Terminal 2 — Frontend (hot-reload)
cd src/Frontend
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5152
- Swagger: http://localhost:5152/swagger

### 2. Full-Stack Docker

Everything in containers (no hot-reload):

```bash
cd infrastructure/docker
docker compose --profile app up -d --build
```

Access:
- Frontend: http://localhost:3000
- Backend (direct): http://localhost:8080
- API through nginx: http://localhost:3000/api/v1/...

### 3. Production

```bash
cd infrastructure/docker

# Copy and edit environment file
cp .env.example .env
# Edit .env with production values (see below)

# Start everything
docker compose --profile app up -d --build

# Verify
docker compose ps
docker compose logs -f api
```

---

## Environment Variables

All variables are defined in `infrastructure/docker/.env` (copy from `.env.example`):

### PostgreSQL

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `fintech` | Database name |
| `POSTGRES_USER` | `fintech` | Database user |
| `POSTGRES_PASSWORD` | `fintech_dev_password` | Database password |
| `POSTGRES_PORT` | `5432` | Exposed port |

### pgAdmin

| Variable | Default | Description |
|----------|---------|-------------|
| `PGADMIN_EMAIL` | `admin@fintech.local` | Login email |
| `PGADMIN_PASSWORD` | `admin` | Login password |
| `PGADMIN_PORT` | `5050` | Exposed port |

### Redis

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_PORT` | `6379` | Exposed port |
| `REDIS_COMMANDER_PORT` | `8081` | Admin UI port |

### RabbitMQ

| Variable | Default | Description |
|----------|---------|-------------|
| `RABBITMQ_USER` | `fintech` | Broker user |
| `RABBITMQ_PASSWORD` | `fintech_dev_password` | Broker password |
| `RABBITMQ_PORT` | `5672` | AMQP port |
| `RABBITMQ_MGMT_PORT` | `15672` | Management UI port |

### Application

| Variable | Default | Description |
|----------|---------|-------------|
| `API_PORT` | `8080` | Backend API port |
| `JWT_SECRET` | (dev key) | JWT signing secret (min 32 chars) |
| `FRONTEND_PORT` | `3000` | Frontend port |

---

## Health Checks

All services have Docker health checks configured:

| Service | Check | Interval |
|---------|-------|----------|
| `postgres` | `pg_isready` | 5s |
| `redis` | `redis-cli ping` | 5s |
| `rabbitmq` | `rabbitmq-diagnostics ping` | 10s |
| `api` | `curl http://localhost:8080/health/live` | 15s |
| `frontend` | `wget http://localhost/health` | 15s |

### Application Health Endpoints

| Endpoint | Purpose | Checks |
|----------|---------|--------|
| `GET /health/live` | Liveness probe | Process is running |
| `GET /health/ready` | Readiness probe | DB + Redis + RabbitMQ reachable |

---

## Docker Commands Reference

```bash
cd infrastructure/docker

# Infrastructure only
docker compose up -d                          # Start
docker compose down                           # Stop
docker compose down -v                        # Stop + delete volumes

# Full stack
docker compose --profile app up -d --build    # Start everything
docker compose --profile app down             # Stop everything

# Logs
docker compose logs -f                        # All services
docker compose logs -f api                    # Single service
docker compose logs --tail=100 api            # Last 100 lines

# Status
docker compose ps                             # Running services
docker compose ps -a                          # All (including stopped)

# Rebuild
docker compose --profile app build --no-cache # Rebuild from scratch

# Shell access
docker exec -it fintech-postgres psql -U fintech -d fintech
docker exec -it fintech-redis redis-cli
docker exec -it fintech-api /bin/sh
```

---

## Admin UIs

| Tool | URL | Credentials |
|------|-----|-------------|
| Swagger | http://localhost:5152/swagger | — |
| pgAdmin | http://localhost:5050 | `admin@fintech.local` / `admin` |
| Redis Commander | http://localhost:8081 | — |
| RabbitMQ Management | http://localhost:15672 | `fintech` / `fintech_dev_password` |

### pgAdmin — Connect to Database

1. Open http://localhost:5050
2. Add New Server:
   - **Name:** `fintech-local`
   - **Host:** `postgres` (Docker network) or `host.docker.internal` (from host)
   - **Port:** `5432`
   - **Database:** `fintech`
   - **Username:** `fintech`
   - **Password:** `fintech_dev_password`

---

## Production Checklist

Before deploying to production:

### Security

- [ ] Change all default passwords in `.env`
- [ ] Generate a cryptographically random JWT secret (64+ characters)
- [ ] Update `Jwt__Issuer` and `Jwt__Audience` to match your domain
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Update CORS origins in `appsettings.Production.json` to your domain
- [ ] Remove pgAdmin, Redis Commander from compose (or firewall them)
- [ ] Enable Redis password: `--requirepass`
- [ ] Enable TLS/SSL termination (reverse proxy or load balancer)
- [ ] Disable Swagger in production (`app.Environment.IsDevelopment()`)

### Performance

- [ ] Set appropriate Redis `maxmemory` for your load
- [ ] Configure PostgreSQL connection pooling (PgBouncer)
- [ ] Set `DOTNET_GCConserveMemory` for memory-constrained environments
- [ ] Tune RabbitMQ prefetch count for consumers

### Observability

- [ ] Configure Serilog sinks for centralized logging (Seq, ELK, etc.)
- [ ] Set log level to `Warning` in production (already in `appsettings.Production.json`)
- [ ] Set up alerting on health check failures
- [ ] Monitor Docker container metrics (CPU, memory)

### Data

- [ ] Set up automated PostgreSQL backups (pg_dump or WAL archiving)
- [ ] Enable Redis persistence (RDB + AOF)
- [ ] Configure RabbitMQ durable queues (MassTransit defaults to durable)

### Infrastructure

- [ ] Run behind a reverse proxy (nginx, Traefik, or cloud LB)
- [ ] Configure resource limits in docker-compose (memory, CPU)
- [ ] Set `restart: always` instead of `unless-stopped`
- [ ] Use Docker secrets instead of environment variables for passwords
- [ ] Set up CI/CD pipeline for automated builds and deploys
