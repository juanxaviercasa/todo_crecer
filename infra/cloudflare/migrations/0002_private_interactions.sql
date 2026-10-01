PRAGMA foreign_keys = ON;

-- Solo conserva huellas pseudónimas y referencias a objetos cifrados.
CREATE TABLE interaction_deduplication (
  fingerprint TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_interaction_deduplication_expiry ON interaction_deduplication(expires_at);

CREATE TABLE interaction_rate_windows (
  ip_hmac TEXT NOT NULL,
  window_start TEXT NOT NULL,
  attempts INTEGER NOT NULL CHECK (attempts >= 0),
  expires_at TEXT NOT NULL,
  PRIMARY KEY (ip_hmac, window_start)
);

CREATE INDEX idx_interaction_rate_expiry ON interaction_rate_windows(expires_at);

CREATE TABLE consent_links (
  consent_id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  consent_object_key TEXT NOT NULL UNIQUE,
  submission_object_key TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('contact_request', 'property_interest', 'valuation_request')),
  status TEXT NOT NULL CHECK (status IN ('active', 'withdrawal_pending', 'deleted')),
  delete_after TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_consent_links_retention ON consent_links(status, delete_after);
