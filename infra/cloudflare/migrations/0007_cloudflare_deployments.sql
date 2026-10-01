PRAGMA foreign_keys = ON;

CREATE TABLE deployment_plans (
  plan_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  site_id TEXT NOT NULL,
  release_id TEXT NOT NULL REFERENCES publication_releases(release_id),
  build_id TEXT NOT NULL REFERENCES publication_builds(build_id),
  environment TEXT NOT NULL CHECK (environment = 'staging'),
  hostname TEXT NOT NULL,
  artifact_digest TEXT NOT NULL,
  execution_mode TEXT NOT NULL CHECK (execution_mode IN ('dry_run','apply')),
  status TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  created_by TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE deployment_executions (
  execution_id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL REFERENCES deployment_plans(plan_id),
  mode TEXT NOT NULL,
  status TEXT NOT NULL,
  operations_json TEXT NOT NULL,
  rollback_triggered INTEGER NOT NULL DEFAULT 0,
  external_changes INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL
);

CREATE TABLE canary_checks (
  check_id TEXT PRIMARY KEY,
  execution_id TEXT NOT NULL REFERENCES deployment_executions(execution_id),
  plan_id TEXT NOT NULL REFERENCES deployment_plans(plan_id),
  stage_percent INTEGER NOT NULL CHECK (stage_percent IN (5,25,50,100)),
  status_code INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL,
  content_digest_match INTEGER NOT NULL,
  security_headers INTEGER NOT NULL,
  indexing_policy TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed','failed')),
  checked_at TEXT NOT NULL
);

CREATE TABLE deployment_drift_reports (
  report_id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL REFERENCES deployment_plans(plan_id),
  status TEXT NOT NULL CHECK (status IN ('in_sync','drifted','unavailable')),
  differences_json TEXT NOT NULL,
  secrets_compared INTEGER NOT NULL DEFAULT 0 CHECK (secrets_compared = 0),
  generated_at TEXT NOT NULL
);
