PRAGMA foreign_keys = ON;

CREATE TABLE tenants (
  tenant_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('onboarding', 'active', 'suspended', 'closed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE principals (
  principal_id TEXT PRIMARY KEY,
  external_subject TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'operator', 'admin', 'system')),
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  created_at TEXT NOT NULL
);

CREATE TABLE tenant_memberships (
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  principal_id TEXT NOT NULL REFERENCES principals(principal_id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'operator', 'admin')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (tenant_id, principal_id)
);

CREATE TABLE private_records (
  record_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  record_type TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  content_sha256 TEXT NOT NULL,
  retention_class TEXT NOT NULL,
  expires_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'deletion_due', 'deleted')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_private_records_tenant ON private_records(tenant_id, record_type, status);
CREATE INDEX idx_private_records_retention ON private_records(status, expires_at);

CREATE TABLE asset_intakes (
  asset_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  quarantine_key TEXT NOT NULL UNIQUE,
  released_key TEXT UNIQUE,
  media_type TEXT NOT NULL,
  bytes INTEGER NOT NULL CHECK (bytes > 0),
  content_sha256 TEXT NOT NULL,
  scan_status TEXT NOT NULL CHECK (scan_status IN ('pending', 'clean', 'malicious', 'failed')),
  rights_status TEXT NOT NULL CHECK (rights_status IN ('pending_review', 'approved', 'rejected')),
  status TEXT NOT NULL CHECK (status IN ('quarantined', 'released', 'rejected')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_asset_intakes_tenant ON asset_intakes(tenant_id, status);

CREATE TABLE audit_entries (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  tenant_id TEXT,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  result TEXT NOT NULL,
  previous_hash TEXT,
  event_hash TEXT NOT NULL UNIQUE,
  signature TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);

CREATE INDEX idx_audit_entries_tenant ON audit_entries(tenant_id, occurred_at);
