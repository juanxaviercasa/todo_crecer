PRAGMA foreign_keys = ON;

CREATE TABLE business_claims (
  claim_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  business_id TEXT NOT NULL,
  claimant_id TEXT NOT NULL REFERENCES principals(principal_id),
  status TEXT NOT NULL CHECK (status IN ('draft','submitted','evidence_pending','verified','rejected','revoked')),
  submitted_at TEXT,
  verified_at TEXT,
  reviewer_id TEXT,
  decision_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_business_claims_tenant ON business_claims(tenant_id, business_id, status);

CREATE TABLE claim_evidence (
  evidence_id TEXT PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES business_claims(claim_id),
  evidence_kind TEXT NOT NULL,
  artifact_sha256 TEXT NOT NULL,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending','accepted','rejected')),
  reviewer_id TEXT,
  review_note TEXT,
  collected_at TEXT NOT NULL
);

CREATE INDEX idx_claim_evidence_claim ON claim_evidence(claim_id, verification_status);

CREATE TABLE product_plans (
  plan_id TEXT NOT NULL,
  plan_version TEXT NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','active','retired')),
  commercial_terms_ref TEXT,
  capabilities_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (plan_id, plan_version)
);

CREATE TABLE subscriptions (
  subscription_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL UNIQUE REFERENCES tenants(tenant_id),
  plan_ref TEXT,
  provider TEXT NOT NULL,
  external_customer_ref TEXT,
  status TEXT NOT NULL,
  trial_ends_at TEXT,
  period_ends_at TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  last_event_at TEXT,
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE billing_events (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  subscription_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  new_status TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  occurred_at TEXT NOT NULL
);

CREATE TABLE entitlement_grants (
  grant_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  capability TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','revoked')),
  limit_value INTEGER,
  starts_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  reason TEXT NOT NULL,
  granted_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_entitlement_grants_active ON entitlement_grants(tenant_id, status, expires_at);
