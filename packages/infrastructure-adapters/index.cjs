'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { validate } = require('../site-engine/index.cjs');

const SERVICE_NAMES = ['identity', 'database', 'key_management', 'object_storage', 'queue', 'malware_scan'];
const encode = value => JSON.stringify(value, null, 2) + '\n';
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function safeId(value, label = 'identifier') {
  if (!/^[a-z0-9][a-z0-9-]{2,100}$/.test(String(value || ''))) {
    throw Object.assign(new Error(`Unsafe ${label}`), { code: 'ID_UNSAFE' });
  }
  return String(value);
}

function atomicJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(temporary, encode(value), { flag: 'wx' });
  fs.renameSync(temporary, file);
}

function atomicText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(temporary, value, { flag: 'wx' });
  fs.renameSync(temporary, file);
}

function loadProfile(file) {
  const profile = JSON.parse(fs.readFileSync(file, 'utf8'));
  validate('infrastructure-profile', profile);
  return profile;
}

function readiness(profile, available = {}, generatedAt = new Date().toISOString()) {
  validate('infrastructure-profile', profile);
  const checks = SERVICE_NAMES.map(service => {
    const definition = profile.services[service];
    const missing = definition.required_configuration.filter(name => !available[name]);
    return { service, provider: definition.provider, status: missing.length ? 'blocked' : 'ready', missing };
  });
  const missing_configuration = [...new Set(checks.flatMap(check => check.missing))].sort();
  const report = {
    schema_version: '0.1.0',
    profile_id: profile.profile_id,
    environment: profile.environment,
    status: missing_configuration.length ? 'blocked' : 'ready',
    checks,
    missing_configuration,
    may_deploy: missing_configuration.length === 0 && profile.environment !== 'production',
    may_publish: false,
    generated_at: generatedAt
  };
  validate('infrastructure-readiness', report);
  return report;
}

function cloudflareBindings(profile) {
  validate('infrastructure-profile', profile);
  if (profile.profile_id !== 'cloudflare-production') {
    throw Object.assign(new Error('Cloudflare production profile required'), { code: 'PROFILE_MISMATCH' });
  }
  const requiredConfiguration = [...new Set(SERVICE_NAMES.flatMap(name => profile.services[name].required_configuration))].sort();
  return Object.freeze({
    d1: 'DB',
    r2: 'PRIVATE_ASSETS',
    queueProducer: 'ASSET_JOBS',
    requiredConfiguration,
    requiredSecrets: requiredConfiguration.filter(name => ['VAULT_KEY', 'AUDIT_KEY', 'SESSION_SIGNING_KEY', 'MALWARE_SCANNER_TOKEN'].includes(name)),
    publication: 'blocked'
  });
}

function createLocalInfrastructure(root, options = {}) {
  const resolvedRoot = path.resolve(root);
  const metadataRoot = path.join(resolvedRoot, 'metadata');
  const quarantineRoot = path.join(resolvedRoot, 'objects', 'quarantine');
  const releasedRoot = path.join(resolvedRoot, 'objects', 'released');
  const queueFile = path.join(resolvedRoot, 'queue.jsonl');
  const sessions = options.sessions instanceof Map ? options.sessions : new Map();
  const secrets = options.secrets || {};
  for (const directory of [metadataRoot, quarantineRoot, releasedRoot]) fs.mkdirSync(directory, { recursive: true });

  const identity = {
    verify(token, expectedTenant = null) {
      const session = sessions.get(String(token || ''));
      if (!session || !['owner', 'operator', 'admin', 'system'].includes(session.role)) {
        throw Object.assign(new Error('Invalid session'), { code: 'SESSION_INVALID' });
      }
      if (expectedTenant && session.role === 'owner' && session.tenant_id !== expectedTenant) {
        throw Object.assign(new Error('Tenant access denied'), { code: 'ACCESS_DENIED' });
      }
      return structuredClone(session);
    }
  };

  const secretStore = {
    get(name) {
      if (!/^[A-Z][A-Z0-9_]{2,79}$/.test(name) || !Object.hasOwn(secrets, name)) {
        throw Object.assign(new Error('Secret unavailable'), { code: 'SECRET_UNAVAILABLE' });
      }
      return secrets[name];
    }
  };

  const database = {
    put(tenantId, recordId, value) {
      safeId(tenantId, 'tenant identifier'); safeId(recordId, 'record identifier');
      const document = { tenant_id: tenantId, record_id: recordId, value, updated_at: new Date().toISOString() };
      atomicJson(path.join(metadataRoot, tenantId, `${recordId}.json`), document);
      return structuredClone(document);
    },
    get(requestTenantId, tenantId, recordId, role = 'owner') {
      safeId(requestTenantId, 'request tenant'); safeId(tenantId, 'tenant identifier'); safeId(recordId, 'record identifier');
      if (role === 'owner' && requestTenantId !== tenantId) throw Object.assign(new Error('Tenant access denied'), { code: 'ACCESS_DENIED' });
      return JSON.parse(fs.readFileSync(path.join(metadataRoot, tenantId, `${recordId}.json`), 'utf8'));
    }
  };

  const objects = {
    quarantine({ tenant_id, asset_id, media_type, bytes }) {
      safeId(tenant_id, 'tenant identifier'); safeId(asset_id, 'asset identifier');
      if (!Buffer.isBuffer(bytes) || bytes.length === 0) throw Object.assign(new Error('Asset bytes required'), { code: 'ASSET_EMPTY' });
      const folder = path.join(quarantineRoot, tenant_id); fs.mkdirSync(folder, { recursive: true });
      const objectPath = path.join(folder, `${asset_id}.bin`);
      fs.writeFileSync(objectPath, bytes, { flag: 'wx' });
      const receipt = { tenant_id, asset_id, media_type, bytes: bytes.length, content_sha256: sha256(bytes), status: 'quarantined' };
      atomicJson(path.join(folder, `${asset_id}.json`), receipt);
      return receipt;
    },
    release(tenantId, assetId, decision) {
      safeId(tenantId, 'tenant identifier'); safeId(assetId, 'asset identifier');
      if (decision.scan_status !== 'clean' || decision.rights_status !== 'approved' || decision.active_content_detected !== false) {
        throw Object.assign(new Error('Asset release blocked'), { code: 'ASSET_BLOCKED' });
      }
      const source = path.join(quarantineRoot, tenantId, `${assetId}.bin`);
      const receiptFile = path.join(quarantineRoot, tenantId, `${assetId}.json`);
      const receipt = JSON.parse(fs.readFileSync(receiptFile, 'utf8'));
      const actual = sha256(fs.readFileSync(source));
      if (actual !== receipt.content_sha256) throw Object.assign(new Error('Object integrity failed'), { code: 'INTEGRITY_FAILED' });
      const destination = path.join(releasedRoot, tenantId); fs.mkdirSync(destination, { recursive: true });
      fs.renameSync(source, path.join(destination, `${assetId}.bin`));
      const released = { ...receipt, status: 'released', released_at: new Date().toISOString() };
      atomicJson(path.join(destination, `${assetId}.json`), released);
      fs.unlinkSync(receiptFile);
      return released;
    }
  };

  function queueRows() {
    if (!fs.existsSync(queueFile)) return [];
    return fs.readFileSync(queueFile, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  }
  function writeQueue(rows) { atomicText(queueFile, rows.map(JSON.stringify).join('\n') + (rows.length ? '\n' : '')); }
  const queue = {
    publish(type, tenantId, payload) {
      safeId(tenantId, 'tenant identifier');
      if (!/^[a-z][a-z0-9.]{2,100}$/.test(type)) throw Object.assign(new Error('Invalid message type'), { code: 'MESSAGE_TYPE_INVALID' });
      const rows = queueRows();
      const message = { id: `msg-${crypto.randomBytes(12).toString('hex')}`, type, tenant_id: tenantId, payload, state: 'pending', created_at: new Date().toISOString() };
      rows.push(message); writeQueue(rows); return structuredClone(message);
    },
    pending(tenantId) { safeId(tenantId, 'tenant identifier'); return queueRows().filter(row => row.tenant_id === tenantId && row.state === 'pending'); },
    ack(messageId) {
      if (!/^msg-[a-f0-9]{24}$/.test(messageId)) throw Object.assign(new Error('Invalid message identifier'), { code: 'ID_UNSAFE' });
      const rows = queueRows(), row = rows.find(item => item.id === messageId);
      if (!row) throw Object.assign(new Error('Message unavailable'), { code: 'MESSAGE_NOT_FOUND' });
      row.state = 'acknowledged'; row.acknowledged_at = new Date().toISOString(); writeQueue(rows); return structuredClone(row);
    }
  };

  return { identity, secretStore, database, objects, queue, paths: { root: resolvedRoot, metadataRoot, quarantineRoot, releasedRoot, queueFile } };
}

module.exports = { SERVICE_NAMES, loadProfile, readiness, cloudflareBindings, createLocalInfrastructure, safeId, sha256 };
