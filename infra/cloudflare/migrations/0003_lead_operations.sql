PRAGMA foreign_keys = ON;

CREATE TABLE lead_cases (
  case_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  site_id TEXT NOT NULL,
  submission_ref TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('contact_request', 'property_interest', 'valuation_request')),
  priority TEXT NOT NULL CHECK (priority IN ('normal', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('new', 'assigned', 'contacted', 'qualified', 'closed')),
  assignee_id TEXT,
  sla_due_at TEXT NOT NULL,
  sla_breached INTEGER NOT NULL DEFAULT 0 CHECK (sla_breached IN (0, 1)),
  version INTEGER NOT NULL CHECK (version >= 1),
  close_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  closed_at TEXT
);

CREATE INDEX idx_lead_cases_tenant_status ON lead_cases(tenant_id, status, updated_at);
CREATE INDEX idx_lead_cases_sla ON lead_cases(status, sla_breached, sla_due_at);

CREATE TABLE lead_events (
  event_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES lead_cases(case_id),
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  event_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  case_version INTEGER NOT NULL,
  changes_json TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);

CREATE INDEX idx_lead_events_case ON lead_events(case_id, occurred_at);

CREATE TABLE delivery_attempts (
  attempt_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  case_id TEXT NOT NULL REFERENCES lead_cases(case_id),
  event_id TEXT NOT NULL REFERENCES lead_events(event_id),
  provider TEXT NOT NULL,
  destination_ref TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  payload_sha256 TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'delivered', 'failed')),
  attempt_count INTEGER NOT NULL CHECK (attempt_count >= 1),
  provider_reference TEXT,
  error_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_delivery_attempts_status ON delivery_attempts(status, updated_at);
