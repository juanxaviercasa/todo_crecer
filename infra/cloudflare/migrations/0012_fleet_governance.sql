-- Phase 22 reference migration. Apply only after an authorized infrastructure review.
CREATE TABLE IF NOT EXISTS recipe_versions (
  recipe_version_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL,
  artifact_digest TEXT NOT NULL,
  document_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, recipe_id, version)
);

CREATE TABLE IF NOT EXISTS design_system_versions (
  design_version_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  design_system_id TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL,
  token_digest TEXT NOT NULL,
  component_digest TEXT NOT NULL,
  document_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, design_system_id, version)
);

CREATE TABLE IF NOT EXISTS fleet_sites (
  tenant_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  current_recipe_ref TEXT NOT NULL,
  current_design_ref TEXT NOT NULL,
  engine_version TEXT NOT NULL,
  status TEXT NOT NULL,
  release_digest TEXT NOT NULL,
  document_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (tenant_id, site_id)
);

CREATE TABLE IF NOT EXISTS fleet_quality_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  status TEXT NOT NULL,
  document_json TEXT NOT NULL,
  generated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rollout_cohorts (
  cohort_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_step INTEGER NOT NULL,
  document_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rollout_checkpoints (
  checkpoint_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cohort_ref TEXT NOT NULL,
  step_percent INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  document_json TEXT NOT NULL,
  evaluated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fleet_drift_reports (
  drift_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  document_json TEXT NOT NULL,
  detected_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fleet_rollback_records (
  rollback_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cohort_ref TEXT NOT NULL,
  status TEXT NOT NULL,
  document_json TEXT NOT NULL,
  planned_at TEXT NOT NULL,
  executed_at TEXT
);
