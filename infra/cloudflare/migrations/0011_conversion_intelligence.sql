CREATE TABLE IF NOT EXISTS conversion_events (
  event_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, site_id TEXT NOT NULL,
  type TEXT NOT NULL, session_bucket TEXT NOT NULL, payload_json TEXT NOT NULL,
  occurred_at TEXT NOT NULL, retention_until TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_conversion_events_site_time ON conversion_events(tenant_id, site_id, occurred_at);

CREATE TABLE IF NOT EXISTS conversion_experiments (
  experiment_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, site_id TEXT NOT NULL,
  definition_digest TEXT NOT NULL, status TEXT NOT NULL, payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conversion_experiment_records (
  record_id TEXT PRIMARY KEY, experiment_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
  kind TEXT NOT NULL, payload_json TEXT NOT NULL, created_at TEXT NOT NULL,
  FOREIGN KEY(experiment_id) REFERENCES conversion_experiments(experiment_id)
);

CREATE TABLE IF NOT EXISTS recipe_learning_proposals (
  proposal_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, experiment_result_ref TEXT NOT NULL,
  status TEXT NOT NULL, auto_publish INTEGER NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
