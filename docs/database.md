# Database Guide

PostgreSQL 16 with schema-per-module isolation, immutable ledger, and RBAC seed data.

---

## Connection Details

| Setting | Development | Docker |
|---------|-------------|--------|
| Host | `localhost` | `postgres` |
| Port | `5432` | `5432` |
| Database | `fintech` | `fintech` |
| Username | `fintech` | `fintech` |
| Password | `fintech_dev_password` | (from `.env`) |

Connection string:
```
Host=localhost;Port=5432;Database=fintech;Username=fintech;Password=fintech_dev_password
```

---

## Schema Overview

Each module owns a dedicated PostgreSQL schema, enforcing isolation at the database level:

| Schema | Module | Tables | Purpose |
|--------|--------|--------|---------|
| `identity` | Identity | 5 | Users, roles, permissions, refresh tokens |
| `wallet` | Wallet | 1 | Wallet accounts |
| `ledger` | Ledger | 1 | Immutable financial entries |
| `transaction` | Transaction | 1 | Transaction records |
| `notification` | Notification | 2 | User notifications + preferences |
| `audit` | Audit | 1 | Audit trail |
| `background_job` | BackgroundJob | 1 | Async job queue |
| `report` | Report | 2 | Generated reports + statistics |

Total: **14 tables** across 8 schemas.

---

## Table Reference

### identity.users

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK, auto-generated |
| `email` | VARCHAR(255) | NOT NULL, unique |
| `password_hash` | VARCHAR(512) | NOT NULL |
| `status` | INTEGER | NOT NULL, default 0 (Active) |
| `first_name` | VARCHAR(100) | |
| `last_name` | VARCHAR(100) | |
| `last_login_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | NOT NULL, default NOW() |
| `updated_at` | TIMESTAMPTZ | |

**Indexes:** `ix_users_email` (unique)

### identity.roles

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `name` | VARCHAR(50) | NOT NULL, unique |
| `type` | INTEGER | NOT NULL, default 0 |
| `description` | VARCHAR(500) | |
| `is_system` | BOOLEAN | NOT NULL, default FALSE |

### identity.permissions

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `name` | VARCHAR(100) | NOT NULL |
| `role_id` | UUID | NOT NULL, FK → roles(id) CASCADE |

**Indexes:** `ix_permissions_role_name` (unique: role_id + name)

### identity.user_roles

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL |
| `role_id` | UUID | NOT NULL, FK → roles(id) RESTRICT |
| `assigned_at` | TIMESTAMPTZ | NOT NULL, default NOW() |
| `assigned_by` | UUID | |

**Indexes:** `ix_user_roles_user_role` (unique: user_id + role_id)

### identity.refresh_tokens

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL |
| `token` | VARCHAR(256) | NOT NULL, unique |
| `expires_at` | TIMESTAMPTZ | NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, default NOW() |
| `revoked_at` | TIMESTAMPTZ | |
| `replaced_by_token` | VARCHAR(256) | |

### wallet.wallets

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL |
| `currency` | VARCHAR(3) | NOT NULL |
| `status` | INTEGER | NOT NULL, default 0 |
| `name` | VARCHAR(100) | NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | |

**Indexes:** `ix_wallets_user_id`, `ix_wallets_currency`, `ix_wallets_status`

### ledger.entries

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `wallet_id` | UUID | NOT NULL |
| `amount` | NUMERIC(18,4) | NOT NULL |
| `currency` | VARCHAR(3) | NOT NULL |
| `reference_id` | UUID | NOT NULL |
| `entry_type` | INTEGER | NOT NULL |
| `description` | VARCHAR(500) | |
| `created_at` | TIMESTAMPTZ | NOT NULL |

**Indexes:** `ix_entries_wallet_id`, `ix_entries_reference_id`, `ix_entries_created_at`

> ⚠️ **Immutable table** — a database trigger (`trg_entries_immutable`) prevents UPDATE and DELETE operations. To correct an entry, create a reversal entry.

### transaction.transactions

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `type` | INTEGER | NOT NULL |
| `status` | INTEGER | NOT NULL, default 0 |
| `amount_amount` | NUMERIC(18,4) | NOT NULL |
| `amount_currency` | CHAR(3) | NOT NULL |
| `source_wallet_id` | UUID | NOT NULL |
| `target_wallet_id` | UUID | nullable (null for deposits/withdrawals) |
| `description` | VARCHAR(500) | |
| `idempotency_key` | VARCHAR(100) | NOT NULL, unique |
| `failure_reason` | VARCHAR(500) | |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |

**Indexes:** `ix_transactions_idempotency` (unique), `ix_transactions_source_wallet_id`, `ix_transactions_target_wallet_id` (partial, WHERE NOT NULL), `ix_transactions_status`, `ix_transactions_created_at`, `ix_transactions_source_wallet_created` (composite)

### notification.notifications

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL |
| `type` | INTEGER | NOT NULL |
| `category` | INTEGER | NOT NULL |
| `status` | INTEGER | NOT NULL, default 0 |
| `title` | VARCHAR(255) | NOT NULL |
| `body` | TEXT | NOT NULL |
| `recipient` | VARCHAR(255) | |
| `error_message` | VARCHAR(500) | |
| `sent_at` | TIMESTAMPTZ | |
| `retry_count` | INTEGER | NOT NULL, default 0 |
| `reference_id` | UUID | |
| `reference_type` | VARCHAR(50) | |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | |

**Indexes:** `ix_notifications_user_id`, `ix_notifications_status`, `ix_notifications_category`, `ix_notifications_created_at`, `ix_notifications_user_status` (composite)

### notification.notification_preferences

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL, unique |
| `email_enabled` | BOOLEAN | default TRUE |
| `push_enabled` | BOOLEAN | default TRUE |
| `sms_enabled` | BOOLEAN | default FALSE |
| `transaction_alerts` | BOOLEAN | default TRUE |
| `security_alerts` | BOOLEAN | default TRUE |
| `marketing_enabled` | BOOLEAN | default FALSE |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | |

### audit.audit_logs

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | nullable (system actions) |
| `action` | VARCHAR(256) | NOT NULL |
| `action_type` | INTEGER | NOT NULL, default 0 |
| `resource_type` | VARCHAR(128) | NOT NULL |
| `resource_id` | VARCHAR(128) | |
| `is_success` | BOOLEAN | NOT NULL, default TRUE |
| `error_message` | VARCHAR(2000) | |
| `duration_ms` | BIGINT | NOT NULL, default 0 |
| `ip_address` | VARCHAR(45) | |
| `user_agent` | VARCHAR(512) | |
| `correlation_id` | VARCHAR(64) | |
| `timestamp` | TIMESTAMPTZ | NOT NULL |

**Indexes:** `ix_audit_logs_user_id`, `ix_audit_logs_action_type`, `ix_audit_logs_resource_type`, `ix_audit_logs_timestamp` (DESC), `ix_audit_logs_correlation_id`

### background_job.jobs

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `job_type` | VARCHAR(256) | NOT NULL |
| `payload` | JSONB | NOT NULL, default '{}' |
| `status` | VARCHAR(50) | NOT NULL, default 'Pending' |
| `progress_percentage` | INTEGER | NOT NULL, default 0 |
| `result_payload` | JSONB | |
| `error_message` | VARCHAR(2000) | |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `started_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |
| `created_by` | UUID | |
| `retry_count` | INTEGER | NOT NULL, default 0 |
| `max_retries` | INTEGER | NOT NULL, default 3 |
| `is_cancellation_requested` | BOOLEAN | NOT NULL, default FALSE |

**Indexes:** `ix_jobs_status`, `ix_jobs_job_type`, `ix_jobs_created_at` (DESC), `ix_jobs_status_type` (composite)

### report.reports

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `Name` | VARCHAR(200) | NOT NULL |
| `Type` | VARCHAR(50) | NOT NULL, default 'General' |
| `Status` | VARCHAR(20) | NOT NULL, default 'Pending' |
| `RequestedBy` | UUID | NOT NULL |
| `PeriodStart` | TIMESTAMPTZ | NOT NULL |
| `PeriodEnd` | TIMESTAMPTZ | NOT NULL |
| `Parameters` | JSONB | |
| `ResultData` | JSONB | |
| `ErrorMessage` | VARCHAR(2000) | |
| `CompletedAt` | TIMESTAMPTZ | |
| `FileSizeBytes` | BIGINT | |
| `CreatedAt` | TIMESTAMPTZ | NOT NULL |
| `UpdatedAt` | TIMESTAMPTZ | |

### report.statistics_snapshots

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `MetricType` | VARCHAR(50) | NOT NULL |
| `Value` | NUMERIC(18,4) | NOT NULL |
| `Timestamp` | TIMESTAMPTZ | NOT NULL |
| `Period` | VARCHAR(20) | NOT NULL |
| `Currency` | VARCHAR(100) | |
| `Metadata` | JSONB | |
| `CreatedAt` | TIMESTAMPTZ | NOT NULL |
| `UpdatedAt` | TIMESTAMPTZ | |

---

## Immutable Ledger

The `ledger.entries` table has a database trigger that prevents modifications:

```sql
CREATE OR REPLACE FUNCTION ledger.prevent_update_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger entries are immutable. Create a reversal entry instead.';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_entries_immutable
    BEFORE UPDATE OR DELETE ON ledger.entries
    FOR EACH ROW
    EXECUTE FUNCTION ledger.prevent_update_delete();
```

To correct a ledger entry, insert a **reversal entry** with the opposite amount. This preserves the full audit trail.

---

## Seed Data

### Roles

| UUID | Name | Type | System |
|------|------|------|--------|
| `a000...0001` | Admin | 0 | ✅ |
| `a000...0002` | User | 1 | ✅ |
| `a000...0003` | Auditor | 2 | ✅ |
| `a000...0004` | Support | 3 | ✅ |

### Permissions per Role

| Permission | Admin | User | Auditor | Support |
|------------|:-----:|:----:|:-------:|:-------:|
| `users:read` | ✅ | ✅ | ✅ | ✅ |
| `users:write` | ✅ | ✅ | | ✅ |
| `users:manage` | ✅ | | | |
| `wallets:read` | ✅ | ✅ | ✅ | ✅ |
| `wallets:write` | ✅ | ✅ | | |
| `wallets:manage` | ✅ | | | |
| `transactions:read` | ✅ | ✅ | ✅ | ✅ |
| `transactions:write` | ✅ | ✅ | | |
| `transactions:manage` | ✅ | | | |
| `audit:read` | ✅ | | ✅ | |
| `audit:export` | ✅ | | ✅ | |
| `reports:read` | ✅ | | ✅ | ✅ |
| `reports:export` | ✅ | | ✅ | |
| `system:manage` | ✅ | | | |

---

## PostgreSQL Extensions

| Extension | Purpose |
|-----------|---------|
| `uuid-ossp` | `uuid_generate_v4()` for auto-generating UUIDs |
| `pgcrypto` | Cryptographic functions (password hashing support) |

---

## Common Queries

### Check wallet balance from ledger

```sql
SELECT wallet_id, currency, SUM(amount) AS balance
FROM ledger.entries
WHERE wallet_id = '<uuid>'
GROUP BY wallet_id, currency;
```

### Recent transactions for a user

```sql
SELECT t.* FROM transaction.transactions t
JOIN wallet.wallets w ON w.id = t.source_wallet_id
WHERE w.user_id = '<uuid>'
ORDER BY t.created_at DESC
LIMIT 20;
```

### Audit trail for a resource

```sql
SELECT * FROM audit.audit_logs
WHERE resource_type = 'Wallet' AND resource_id = '<uuid>'
ORDER BY timestamp DESC;
```

### User permissions

```sql
SELECT p.name FROM identity.permissions p
JOIN identity.user_roles ur ON ur.role_id = p.role_id
WHERE ur.user_id = '<uuid>';
```

---

## pgAdmin Setup

1. Start Docker infrastructure: `docker compose up -d`
2. Open http://localhost:5050
3. Login: `admin@fintech.local` / `admin`
4. **Add New Server:**
   - General → Name: `fintech-local`
   - Connection → Host: `postgres`
   - Connection → Port: `5432`
   - Connection → Database: `fintech`
   - Connection → Username: `fintech`
   - Connection → Password: `fintech_dev_password`
5. Browse schemas under Databases → fintech → Schemas
