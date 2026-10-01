PRAGMA foreign_keys = ON;

CREATE TABLE portal_sessions (
  session_id TEXT PRIMARY KEY,
  principal_id TEXT NOT NULL REFERENCES principals(principal_id),
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'operator', 'admin')),
  assurance TEXT NOT NULL CHECK (assurance IN ('aal1', 'aal2')),
  csrf_sha256 TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked', 'expired')),
  issued_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  idle_expires_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  reauthenticated_at TEXT
);

CREATE INDEX idx_portal_sessions_expiry ON portal_sessions(status, idle_expires_at, expires_at);

CREATE TABLE owner_preferences (
  preference_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  principal_id TEXT NOT NULL REFERENCES principals(principal_id),
  locale TEXT NOT NULL,
  timezone TEXT NOT NULL,
  notifications_json TEXT NOT NULL,
  digest TEXT NOT NULL CHECK (digest IN ('immediate', 'daily', 'off')),
  version INTEGER NOT NULL CHECK (version >= 1),
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, principal_id)
);

CREATE TABLE privacy_requests (
  request_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  principal_id TEXT NOT NULL REFERENCES principals(principal_id),
  request_type TEXT NOT NULL,
  scope TEXT NOT NULL,
  subject_ref TEXT NOT NULL,
  status TEXT NOT NULL,
  verification_ref TEXT,
  rejection_reason TEXT,
  due_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_privacy_requests_queue ON privacy_requests(tenant_id, status, due_at);

CREATE TABLE business_change_requests (
  change_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  business_id TEXT NOT NULL,
  requested_by TEXT NOT NULL REFERENCES principals(principal_id),
  base_truth_sha256 TEXT NOT NULL,
  operations_json TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'approved', 'rejected', 'superseded')),
  reviewer_id TEXT,
  review_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_business_changes_review ON business_change_requests(tenant_id, status, updated_at);

CREATE TABLE portal_audit_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  session_ref TEXT,
  principal_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_ref TEXT NOT NULL,
  outcome TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  previous_hash TEXT,
  event_hash TEXT NOT NULL UNIQUE,
  signature TEXT NOT NULL
);

CREATE INDEX idx_portal_audit_tenant ON portal_audit_events(tenant_id, occurred_at);
