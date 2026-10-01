CREATE TABLE IF NOT EXISTS pilot_dossiers (
  dossier_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, business_id TEXT NOT NULL,
  site_id TEXT NOT NULL, revision INTEGER NOT NULL, status TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL, payload_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pilot_dossiers_tenant ON pilot_dossiers(tenant_id, updated_at);

CREATE TABLE IF NOT EXISTS pilot_decisions (
  decision_id TEXT PRIMARY KEY, dossier_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
  dossier_hash TEXT NOT NULL, kind TEXT NOT NULL, area TEXT, decision TEXT NOT NULL,
  payload_json TEXT NOT NULL, created_at TEXT NOT NULL,
  FOREIGN KEY(dossier_id) REFERENCES pilot_dossiers(dossier_id)
);
CREATE INDEX IF NOT EXISTS idx_pilot_decisions_snapshot ON pilot_decisions(dossier_id, dossier_hash, kind);

CREATE TABLE IF NOT EXISTS pilot_rehearsals (
  rehearsal_id TEXT PRIMARY KEY, dossier_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
  dossier_hash TEXT NOT NULL, status TEXT NOT NULL, payload_json TEXT NOT NULL, performed_at TEXT NOT NULL,
  FOREIGN KEY(dossier_id) REFERENCES pilot_dossiers(dossier_id)
);

CREATE TABLE IF NOT EXISTS pilot_launch_packages (
  package_id TEXT PRIMARY KEY, dossier_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
  dossier_hash TEXT NOT NULL, content_digest TEXT NOT NULL, status TEXT NOT NULL,
  payload_json TEXT NOT NULL, generated_at TEXT NOT NULL,
  FOREIGN KEY(dossier_id) REFERENCES pilot_dossiers(dossier_id)
);
