CREATE TABLE IF NOT EXISTS go_live_plans (
  plan_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, business_id TEXT NOT NULL,
  site_id TEXT NOT NULL, plan_digest TEXT NOT NULL, revision INTEGER NOT NULL,
  status TEXT NOT NULL, payload_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_go_live_plans_tenant ON go_live_plans(tenant_id, updated_at);

CREATE TABLE IF NOT EXISTS go_live_decisions (
  decision_id TEXT PRIMARY KEY, plan_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
  plan_digest TEXT NOT NULL, area TEXT NOT NULL, decision TEXT NOT NULL,
  payload_json TEXT NOT NULL, created_at TEXT NOT NULL,
  FOREIGN KEY(plan_id) REFERENCES go_live_plans(plan_id)
);

CREATE TABLE IF NOT EXISTS go_live_runs (
  run_id TEXT PRIMARY KEY, plan_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
  plan_digest TEXT NOT NULL, status TEXT NOT NULL, payload_json TEXT NOT NULL,
  started_at TEXT NOT NULL, completed_at TEXT,
  FOREIGN KEY(plan_id) REFERENCES go_live_plans(plan_id)
);

CREATE TABLE IF NOT EXISTS go_live_signals (
  signal_id TEXT PRIMARY KEY, run_id TEXT NOT NULL, plan_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL, kind TEXT NOT NULL, status TEXT NOT NULL,
  payload_json TEXT NOT NULL, observed_at TEXT NOT NULL,
  FOREIGN KEY(run_id) REFERENCES go_live_runs(run_id)
);
CREATE INDEX IF NOT EXISTS idx_go_live_signals_run ON go_live_signals(run_id, observed_at);
