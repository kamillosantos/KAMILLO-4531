-- KJS Data Genius append-only event ledger.
-- Apply through the approved database migration process before enabling the UI in a shared environment.
CREATE TABLE IF NOT EXISTS ecosystem_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  source_system TEXT NOT NULL,
  source_component TEXT NOT NULL,
  source_version TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
  event_class TEXT NOT NULL CHECK (event_class IN ('OBSERVED', 'TEST', 'PREDICTED', 'SYNTHETIC')),
  correlation_id TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  status TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS ecosystem_events_created_at_idx ON ecosystem_events (created_at);
CREATE INDEX IF NOT EXISTS ecosystem_events_environment_class_idx ON ecosystem_events (environment, event_class);
CREATE INDEX IF NOT EXISTS ecosystem_events_correlation_idx ON ecosystem_events (correlation_id);
