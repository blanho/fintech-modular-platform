-- =============================================
-- FinTech Platform - Database Initialization
-- =============================================

-- Create schemas for each module
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS wallet;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS transaction;
CREATE SCHEMA IF NOT EXISTS notification;

-- Grant permissions
GRANT ALL ON SCHEMA identity TO fintech;
GRANT ALL ON SCHEMA wallet TO fintech;
GRANT ALL ON SCHEMA ledger TO fintech;
GRANT ALL ON SCHEMA transaction TO fintech;
GRANT ALL ON SCHEMA notification TO fintech;

-- =============================================
-- Ledger Immutability Protection
-- =============================================
-- This function prevents any UPDATE or DELETE on ledger entries
-- CRITICAL: Ledger is append-only for audit compliance

CREATE OR REPLACE FUNCTION prevent_ledger_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger entries are immutable and cannot be modified or deleted. Code: LEDGER_IMMUTABLE';
END;
$$ LANGUAGE plpgsql;

-- Note: The trigger will be created when the ledger.entries table is created
-- CREATE TRIGGER ledger_immutable_trigger
--     BEFORE UPDATE OR DELETE ON ledger.entries
--     FOR EACH ROW
--     EXECUTE FUNCTION prevent_ledger_modification();

-- =============================================
-- Utility Functions
-- =============================================

-- Function to generate UUIDs (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'FinTech database initialized successfully with schemas: identity, wallet, ledger, transaction, notification';
END $$;
