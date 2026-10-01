-- Phase 23 reference migration. Apply only after an authorized infrastructure review.
CREATE TABLE IF NOT EXISTS desired_states (
  desired_state_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  generation INTEGER NOT NULL,
  document_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, site_id, generation)
);

CREATE TABLE IF NOT EXISTS observed_states (
  observed_state_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  generation INTEGER NOT NULL,
  document_json TEXT NOT NULL,
  observed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orchestration_jobs (
  job_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  payload_digest TEXT NOT NULL,
  status TEXT NOT NULL,
  priority INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  available_at TEXT NOT NULL,
  document_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS orchestration_jobs_ready
ON orchestration_jobs (tenant_id, status, available_at, priority);

CREATE TABLE IF NOT EXISTS worker_leases (
  lease_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  job_ref TEXT NOT NULL,
  worker_id TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  document_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS retry_schedules (
  retry_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  job_ref TEXT NOT NULL,
  available_at TEXT NOT NULL,
  document_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dead_letter_entries (
  entry_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  job_ref TEXT NOT NULL,
  status TEXT NOT NULL,
  document_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS operation_budgets (
  budget_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  status TEXT NOT NULL,
  document_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
