PRAGMA foreign_keys = ON;

CREATE TABLE telemetry_events (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  service TEXT NOT NULL,
  release_ref TEXT,
  event_type TEXT NOT NULL,
  outcome TEXT NOT NULL,
  count_value INTEGER NOT NULL,
  duration_ms INTEGER,
  bytes_value INTEGER,
  occurred_at TEXT NOT NULL
);
CREATE INDEX idx_telemetry_window ON telemetry_events(tenant_id, service, occurred_at);

CREATE TABLE slo_evaluations (
  evaluation_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  slo_ref TEXT NOT NULL,
  service TEXT NOT NULL,
  window_start TEXT NOT NULL,
  window_end TEXT NOT NULL,
  sample_size INTEGER NOT NULL,
  availability_percent REAL,
  latency_p95_ms INTEGER,
  error_budget_consumed_percent REAL,
  status TEXT NOT NULL,
  release_refs_json TEXT NOT NULL,
  evaluated_at TEXT NOT NULL
);

CREATE TABLE usage_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  policy_ref TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  resources_json TEXT NOT NULL,
  generated_at TEXT NOT NULL
);

CREATE TABLE operational_alerts (
  alert_id TEXT PRIMARY KEY,
  dedupe_key TEXT NOT NULL UNIQUE,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  service TEXT NOT NULL,
  release_ref TEXT,
  alert_kind TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_ref TEXT NOT NULL,
  occurrences INTEGER NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);

CREATE TABLE incidents (
  incident_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  alert_refs_json TEXT NOT NULL,
  release_refs_json TEXT NOT NULL,
  commander_id TEXT NOT NULL,
  timeline_json TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  resolved_at TEXT
);
