CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS wallet;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS transaction;
CREATE SCHEMA IF NOT EXISTS notification;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS background_job;
CREATE SCHEMA IF NOT EXISTS report;

CREATE TABLE identity.users (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(512) NOT NULL,
    status          INTEGER      NOT NULL DEFAULT 0,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX ix_users_email ON identity.users (email);

CREATE TABLE identity.roles (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(50) NOT NULL,
    type        INTEGER     NOT NULL DEFAULT 0,
    description VARCHAR(500),
    is_system   BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX ix_roles_name ON identity.roles (name);

CREATE TABLE identity.permissions (
    id      UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    name    VARCHAR(100) NOT NULL,
    role_id UUID         NOT NULL REFERENCES identity.roles(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX ix_permissions_role_name ON identity.permissions (role_id, name);

CREATE TABLE identity.user_roles (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL,
    role_id     UUID        NOT NULL REFERENCES identity.roles(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID
);

CREATE UNIQUE INDEX ix_user_roles_user_role ON identity.user_roles (user_id, role_id);
CREATE INDEX ix_user_roles_role_id ON identity.user_roles (role_id);

CREATE TABLE identity.refresh_tokens (
    id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID         NOT NULL,
    token             VARCHAR(256) NOT NULL,
    expires_at        TIMESTAMPTZ  NOT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    revoked_at        TIMESTAMPTZ,
    replaced_by_token VARCHAR(256)
);

CREATE INDEX ix_refresh_tokens_user_id ON identity.refresh_tokens (user_id);
CREATE UNIQUE INDEX ix_refresh_tokens_token ON identity.refresh_tokens (token);

CREATE TABLE wallet.wallets (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID        NOT NULL,
    currency   VARCHAR(3)  NOT NULL,
    status     INTEGER     NOT NULL DEFAULT 0,
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX ix_wallets_user_id  ON wallet.wallets (user_id);
CREATE INDEX ix_wallets_currency ON wallet.wallets (currency);
CREATE INDEX ix_wallets_status   ON wallet.wallets (status);

CREATE TABLE ledger.entries (
    id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id    UUID           NOT NULL,
    amount       NUMERIC(18,4)  NOT NULL,
    currency     VARCHAR(3)     NOT NULL,
    reference_id UUID           NOT NULL,
    entry_type   INTEGER        NOT NULL,
    description  VARCHAR(500),
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_entries_wallet_id    ON ledger.entries (wallet_id);
CREATE INDEX ix_entries_reference_id ON ledger.entries (reference_id);
CREATE INDEX ix_entries_created_at   ON ledger.entries (created_at);

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

CREATE TABLE transaction.transactions (
    id                UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    type              INTEGER        NOT NULL,
    status            INTEGER        NOT NULL DEFAULT 0,
    amount_amount     NUMERIC(18,4)  NOT NULL,
    amount_currency   CHAR(3)        NOT NULL,
    source_wallet_id  UUID           NOT NULL,
    target_wallet_id  UUID,
    description       VARCHAR(500),
    idempotency_key   VARCHAR(100)   NOT NULL,
    failure_reason    VARCHAR(500),
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ,
    completed_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX ix_transactions_idempotency     ON transaction.transactions (idempotency_key);
CREATE INDEX ix_transactions_source_wallet_id       ON transaction.transactions (source_wallet_id);
CREATE INDEX ix_transactions_target_wallet_id       ON transaction.transactions (target_wallet_id) WHERE target_wallet_id IS NOT NULL;
CREATE INDEX ix_transactions_status                 ON transaction.transactions (status);
CREATE INDEX ix_transactions_created_at             ON transaction.transactions (created_at);
CREATE INDEX ix_transactions_source_wallet_created  ON transaction.transactions (source_wallet_id, created_at);

CREATE TABLE notification.notifications (
    id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID         NOT NULL,
    type            INTEGER      NOT NULL,
    category        INTEGER      NOT NULL,
    status          INTEGER      NOT NULL DEFAULT 0,
    title           VARCHAR(255) NOT NULL,
    body            TEXT         NOT NULL,
    recipient       VARCHAR(255),
    error_message   VARCHAR(500),
    sent_at         TIMESTAMPTZ,
    retry_count     INTEGER      NOT NULL DEFAULT 0,
    reference_id    UUID,
    reference_type  VARCHAR(50),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE INDEX ix_notifications_user_id     ON notification.notifications (user_id);
CREATE INDEX ix_notifications_status      ON notification.notifications (status);
CREATE INDEX ix_notifications_category    ON notification.notifications (category);
CREATE INDEX ix_notifications_created_at  ON notification.notifications (created_at);
CREATE INDEX ix_notifications_user_status ON notification.notifications (user_id, status);

CREATE TABLE notification.notification_preferences (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID        NOT NULL,
    email_enabled       BOOLEAN     NOT NULL DEFAULT TRUE,
    push_enabled        BOOLEAN     NOT NULL DEFAULT TRUE,
    sms_enabled         BOOLEAN     NOT NULL DEFAULT FALSE,
    transaction_alerts  BOOLEAN     NOT NULL DEFAULT TRUE,
    security_alerts     BOOLEAN     NOT NULL DEFAULT TRUE,
    marketing_enabled   BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX ix_preferences_user_id ON notification.notification_preferences (user_id);

CREATE TABLE audit.audit_logs (
    id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID,
    action          VARCHAR(256) NOT NULL,
    action_type     INTEGER      NOT NULL DEFAULT 0,
    resource_type   VARCHAR(128) NOT NULL,
    resource_id     VARCHAR(128),
    is_success      BOOLEAN      NOT NULL DEFAULT TRUE,
    error_message   VARCHAR(2000),
    duration_ms     BIGINT       NOT NULL DEFAULT 0,
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(512),
    correlation_id  VARCHAR(64),
    timestamp       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_audit_logs_user_id        ON audit.audit_logs (user_id);
CREATE INDEX ix_audit_logs_action_type    ON audit.audit_logs (action_type);
CREATE INDEX ix_audit_logs_resource_type  ON audit.audit_logs (resource_type);
CREATE INDEX ix_audit_logs_timestamp      ON audit.audit_logs (timestamp DESC);
CREATE INDEX ix_audit_logs_correlation_id ON audit.audit_logs (correlation_id);

CREATE TABLE background_job.jobs (
    id                          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type                    VARCHAR(256) NOT NULL,
    payload                     JSONB        NOT NULL DEFAULT '{}',
    status                      VARCHAR(50)  NOT NULL DEFAULT 'Pending',
    progress_percentage         INTEGER      NOT NULL DEFAULT 0,
    result_payload              JSONB,
    error_message               VARCHAR(2000),
    created_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    started_at                  TIMESTAMPTZ,
    completed_at                TIMESTAMPTZ,
    created_by                  UUID,
    retry_count                 INTEGER      NOT NULL DEFAULT 0,
    max_retries                 INTEGER      NOT NULL DEFAULT 3,
    is_cancellation_requested   BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX ix_jobs_status      ON background_job.jobs (status);
CREATE INDEX ix_jobs_job_type    ON background_job.jobs (job_type);
CREATE INDEX ix_jobs_created_at  ON background_job.jobs (created_at DESC);
CREATE INDEX ix_jobs_status_type ON background_job.jobs (status, job_type);

CREATE TABLE report.reports (
    id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name"              VARCHAR(200) NOT NULL,
    "Type"              VARCHAR(50)  NOT NULL DEFAULT 'General',
    "Status"            VARCHAR(20)  NOT NULL DEFAULT 'Pending',
    "RequestedBy"       UUID         NOT NULL,
    "PeriodStart"       TIMESTAMPTZ  NOT NULL,
    "PeriodEnd"         TIMESTAMPTZ  NOT NULL,
    "Parameters"        JSONB,
    "ResultData"        JSONB,
    "ErrorMessage"      VARCHAR(2000),
    "CompletedAt"       TIMESTAMPTZ,
    "FileSizeBytes"     BIGINT,
    "CreatedAt"         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "UpdatedAt"         TIMESTAMPTZ
);

CREATE INDEX ix_reports_requested_by ON report.reports ("RequestedBy");
CREATE INDEX ix_reports_status       ON report.reports ("Status");
CREATE INDEX ix_reports_type_status  ON report.reports ("Type", "Status");
CREATE INDEX ix_reports_period       ON report.reports ("PeriodStart", "PeriodEnd");

CREATE TABLE report.statistics_snapshots (
    id                  UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    "MetricType"        VARCHAR(50)    NOT NULL,
    "Value"             NUMERIC(18,4)  NOT NULL,
    "Timestamp"         TIMESTAMPTZ    NOT NULL,
    "Period"            VARCHAR(20)    NOT NULL,
    "Currency"          VARCHAR(100),
    "Metadata"          JSONB,
    "CreatedAt"         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "UpdatedAt"         TIMESTAMPTZ
);

CREATE INDEX ix_statistics_metric_period ON report.statistics_snapshots ("MetricType", "Period");
CREATE INDEX ix_statistics_metric_ts     ON report.statistics_snapshots ("MetricType", "Timestamp");
CREATE INDEX ix_statistics_timestamp     ON report.statistics_snapshots ("Timestamp");

INSERT INTO identity.roles (id, name, type, description, is_system) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Admin',   0, 'Full system access',                          TRUE),
    ('a0000000-0000-0000-0000-000000000002', 'User',    1, 'Standard user with basic wallet and tx ops',  TRUE),
    ('a0000000-0000-0000-0000-000000000003', 'Auditor', 2, 'Read-only access to audit and report data',   TRUE),
    ('a0000000-0000-0000-0000-000000000004', 'Support', 3, 'Customer support with limited write access',  TRUE);

INSERT INTO identity.permissions (id, name, role_id) VALUES
    (uuid_generate_v4(), 'users:read',         'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'users:write',        'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'users:manage',       'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'wallets:read',       'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'wallets:write',      'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'wallets:manage',     'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'transactions:read',  'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'transactions:write', 'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'transactions:manage','a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'audit:read',         'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'audit:export',       'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'reports:read',       'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'reports:export',     'a0000000-0000-0000-0000-000000000001'),
    (uuid_generate_v4(), 'system:manage',      'a0000000-0000-0000-0000-000000000001');

INSERT INTO identity.permissions (id, name, role_id) VALUES
    (uuid_generate_v4(), 'users:read',         'a0000000-0000-0000-0000-000000000002'),
    (uuid_generate_v4(), 'users:write',        'a0000000-0000-0000-0000-000000000002'),
    (uuid_generate_v4(), 'wallets:read',       'a0000000-0000-0000-0000-000000000002'),
    (uuid_generate_v4(), 'wallets:write',      'a0000000-0000-0000-0000-000000000002'),
    (uuid_generate_v4(), 'transactions:read',  'a0000000-0000-0000-0000-000000000002'),
    (uuid_generate_v4(), 'transactions:write', 'a0000000-0000-0000-0000-000000000002');

INSERT INTO identity.permissions (id, name, role_id) VALUES
    (uuid_generate_v4(), 'users:read',         'a0000000-0000-0000-0000-000000000003'),
    (uuid_generate_v4(), 'wallets:read',       'a0000000-0000-0000-0000-000000000003'),
    (uuid_generate_v4(), 'transactions:read',  'a0000000-0000-0000-0000-000000000003'),
    (uuid_generate_v4(), 'audit:read',         'a0000000-0000-0000-0000-000000000003'),
    (uuid_generate_v4(), 'audit:export',       'a0000000-0000-0000-0000-000000000003'),
    (uuid_generate_v4(), 'reports:read',       'a0000000-0000-0000-0000-000000000003'),
    (uuid_generate_v4(), 'reports:export',     'a0000000-0000-0000-0000-000000000003');

INSERT INTO identity.permissions (id, name, role_id) VALUES
    (uuid_generate_v4(), 'users:read',         'a0000000-0000-0000-0000-000000000004'),
    (uuid_generate_v4(), 'users:write',        'a0000000-0000-0000-0000-000000000004'),
    (uuid_generate_v4(), 'wallets:read',       'a0000000-0000-0000-0000-000000000004'),
    (uuid_generate_v4(), 'transactions:read',  'a0000000-0000-0000-0000-000000000004'),
    (uuid_generate_v4(), 'reports:read',       'a0000000-0000-0000-0000-000000000004');

DO $$
DECLARE
    schema_name TEXT;
BEGIN
    FOR schema_name IN
        SELECT unnest(ARRAY[
            'identity', 'wallet', 'ledger', 'transaction',
            'notification', 'audit', 'background_job', 'report'
        ])
    LOOP
        EXECUTE format('GRANT USAGE ON SCHEMA %I TO fintech', schema_name);
        EXECUTE format('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA %I TO fintech', schema_name);
        EXECUTE format('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA %I TO fintech', schema_name);
        EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL PRIVILEGES ON TABLES TO fintech', schema_name);
        EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL PRIVILEGES ON SEQUENCES TO fintech', schema_name);
    END LOOP;
END
$$;
