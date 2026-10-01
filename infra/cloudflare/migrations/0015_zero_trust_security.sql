-- Reference migration only. Not applied to a remote environment.
CREATE TABLE IF NOT EXISTS service_identities (
  identity_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','suspended','revoked')),
  tenant_scopes_json TEXT NOT NULL,
  capabilities_json TEXT NOT NULL,
  labels_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS service_credentials (
  credential_id TEXT PRIMARY KEY,
  identity_ref TEXT NOT NULL REFERENCES service_identities(identity_id),
  key_ref TEXT NOT NULL,
  audience TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  issued_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','revoked','expired'))
);

CREATE INDEX IF NOT EXISTS service_credentials_expiry ON service_credentials(status, expires_at);

CREATE TABLE IF NOT EXISTS privileged_operations (
  operation_id TEXT PRIMARY KEY,
  requester_ref TEXT NOT NULL,
  capability TEXT NOT NULL,
  resource TEXT NOT NULL,
  risk TEXT NOT NULL CHECK (risk IN ('high','critical')),
  required_approvals INTEGER NOT NULL,
  status TEXT NOT NULL,
  justification TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  executed_at TEXT
);

CREATE TABLE IF NOT EXISTS operation_approvals (
  approval_id TEXT PRIMARY KEY,
  operation_ref TEXT NOT NULL REFERENCES privileged_operations(operation_id),
  approver_ref TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approve','reject')),
  comment TEXT NOT NULL,
  decided_at TEXT NOT NULL,
  UNIQUE(operation_ref, approver_ref)
);

CREATE TABLE IF NOT EXISTS security_audit_entries (
  sequence INTEGER PRIMARY KEY,
  entry_id TEXT NOT NULL UNIQUE,
  actor_ref TEXT NOT NULL,
  action TEXT NOT NULL,
  subject_ref TEXT NOT NULL,
  decision TEXT NOT NULL,
  details_digest TEXT NOT NULL,
  previous_hash TEXT,
  entry_hash TEXT NOT NULL UNIQUE,
  key_ref TEXT NOT NULL,
  signature TEXT NOT NULL,
  created_at TEXT NOT NULL
);
