PRAGMA foreign_keys = ON;

CREATE TABLE publication_builds (
  build_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  site_id TEXT NOT NULL,
  snapshot_id TEXT NOT NULL,
  artifact_digest TEXT NOT NULL,
  entrypoint TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('preview','production')),
  qa_status TEXT NOT NULL CHECK (qa_status = 'passed'),
  approval_status TEXT NOT NULL CHECK (approval_status IN ('pending','approved','rejected','revoked')),
  registered_by TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_publication_builds_site ON publication_builds(tenant_id, site_id, environment, approval_status);

CREATE TABLE domain_bindings (
  binding_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  hostname TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('managed_subdomain','custom_domain')),
  verification_status TEXT NOT NULL,
  certificate_status TEXT NOT NULL,
  provider_ref TEXT,
  last_checked_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE tenant_routes (
  route_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  site_id TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('preview','production')),
  hostname TEXT NOT NULL,
  path_prefix TEXT NOT NULL DEFAULT '/',
  domain_binding_ref TEXT NOT NULL REFERENCES domain_bindings(binding_id),
  status TEXT NOT NULL CHECK (status IN ('reserved','ready','active','suspended')),
  active_release_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(hostname, path_prefix)
);

CREATE TABLE publication_releases (
  release_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  site_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  build_id TEXT NOT NULL REFERENCES publication_builds(build_id),
  route_id TEXT NOT NULL REFERENCES tenant_routes(route_id),
  sequence INTEGER NOT NULL,
  reason TEXT NOT NULL,
  rollback_of TEXT,
  previous_release_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active','superseded','failed')),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(route_id, sequence)
);

CREATE TABLE cache_purge_requests (
  purge_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  route_id TEXT NOT NULL REFERENCES tenant_routes(route_id),
  release_id TEXT NOT NULL REFERENCES publication_releases(release_id),
  scope TEXT NOT NULL CHECK (scope IN ('release','paths')),
  paths_json TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE publication_audit_events (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  site_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  previous_hash TEXT,
  event_hash TEXT NOT NULL UNIQUE,
  occurred_at TEXT NOT NULL
);
