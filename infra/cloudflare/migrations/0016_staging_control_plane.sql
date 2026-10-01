-- Reference migration only. Not applied to any remote database.
CREATE TABLE IF NOT EXISTS staging_environments (
  environment_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  data_classification TEXT NOT NULL CHECK (data_classification = 'synthetic'),
  status TEXT NOT NULL,
  external_changes_allowed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS staging_resources (
  resource_id TEXT PRIMARY KEY,
  environment_ref TEXT NOT NULL REFERENCES staging_environments(environment_id),
  kind TEXT NOT NULL,
  logical_name TEXT NOT NULL,
  desired_digest TEXT NOT NULL,
  dependencies_json TEXT NOT NULL,
  lifecycle TEXT NOT NULL,
  status TEXT NOT NULL,
  UNIQUE(environment_ref, logical_name)
);
CREATE TABLE IF NOT EXISTS staging_plans (
  plan_id TEXT PRIMARY KEY,
  environment_ref TEXT NOT NULL REFERENCES staging_environments(environment_id),
  plan_digest TEXT NOT NULL UNIQUE,
  mode TEXT NOT NULL,
  estimated_monthly_cost_cents INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_by TEXT NOT NULL,
  approved_by TEXT,
  created_at TEXT NOT NULL,
  approved_at TEXT
);
CREATE TABLE IF NOT EXISTS staging_inventory (
  inventory_id TEXT PRIMARY KEY,
  environment_ref TEXT NOT NULL REFERENCES staging_environments(environment_id),
  inventory_digest TEXT NOT NULL,
  resources_json TEXT NOT NULL,
  generated_at TEXT NOT NULL
);
