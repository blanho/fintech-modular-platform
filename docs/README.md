# FinTech Platform — Developer Documentation

Welcome! This documentation will help you understand, set up, and contribute to the FinTech Modular Platform.

## 📖 Guides

| Guide | Description | Start Here If... |
|-------|-------------|------------------|
| [Getting Started](getting-started.md) | Prerequisites, setup, first API calls | You're new to the project |
| [Architecture](architecture.md) | System design, tech stack, key decisions | You want to understand the "why" |
| [Project Structure](project-structure.md) | Folder layout, module patterns, naming | You need to find or create files |
| [API Reference](api-reference.md) | All endpoints, request/response formats, errors | You're building frontend or integrating |
| [Development Guide](development-guide.md) | Adding modules, commands, events, tests, coding standards | You're writing backend code |
| [Frontend Guide](frontend-guide.md) | React patterns, state management, design system | You're writing frontend code |
| [Deployment](deployment.md) | Docker services, environment variables, production checklist | You're deploying or configuring infra |
| [Database](database.md) | Schemas, tables, seed data, common queries | You're working with data |

## 🚀 Quick Start

```bash
git clone <repository-url>
cd fintech-modular-platform

# Start infrastructure
cd infrastructure/docker && docker compose up -d && cd ../..

# Backend
cd src/Backend/Host/FinTech.Api && dotnet run

# Frontend (new terminal)
cd src/Frontend && npm install && npm run dev
```

Open http://localhost:3000 — you're ready to go.

## 🏗️ Tech Stack at a Glance

| Layer | Technologies |
|-------|-------------|
| **Backend** | .NET 9, ASP.NET Core, EF Core, MediatR, FluentValidation, MassTransit |
| **Frontend** | React 19, TypeScript, Vite, MUI 7, TanStack Query, Zustand |
| **Infrastructure** | PostgreSQL 16, Redis 7, RabbitMQ 3.13, Docker, nginx |
