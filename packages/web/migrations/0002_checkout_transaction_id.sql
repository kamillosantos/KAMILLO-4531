-- Stable transaction identity for gateway-scoped payment deduplication.
ALTER TABLE checkouts ADD COLUMN transaction_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS checkouts_gateway_transaction_id_uq ON checkouts(gateway, transaction_id) WHERE transaction_id IS NOT NULL;
