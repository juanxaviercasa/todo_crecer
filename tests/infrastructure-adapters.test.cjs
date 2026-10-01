'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { loadProfile, readiness, cloudflareBindings, createLocalInfrastructure } = require('../packages/infrastructure-adapters/index.cjs');
const { server } = require('../scripts/serve-infrastructure-console.cjs');

const ROOT = path.resolve(__dirname, '..');
const localProfile = () => loadProfile(path.join(ROOT, 'infra/profiles/local.json'));
const cloudflareProfile = () => loadProfile(path.join(ROOT, 'infra/profiles/cloudflare-production.json'));
function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tl-infra-'));
  const sessions = new Map([['owner-token', { actor_id: 'owner-demo', role: 'owner', tenant_id: 'horizonte-casa-demo' }]]);
  const infrastructure = createLocalInfrastructure(root, { sessions, secrets: { VAULT_KEY: Buffer.alloc(32), AUDIT_KEY: Buffer.alloc(32) } });
  t.after(() => { const resolved = path.resolve(root); assert(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep)); fs.rmSync(resolved, { recursive: true, force: true }); });
  return infrastructure;
}

test('profiles validate and production remains configuration-only with publication blocked', () => {
  assert.equal(localProfile().mode, 'executable');
  const cloudflare = cloudflareProfile();
  assert.equal(cloudflare.mode, 'configuration_only');
  assert.equal(cloudflare.publication.allowed, false);
});

test('readiness lists exact missing configuration without exposing values', () => {
  const blocked = readiness(cloudflareProfile(), {}, '2026-09-30T21:00:00Z');
  assert.equal(blocked.status, 'blocked');
  assert(blocked.missing_configuration.includes('CF_D1_DATABASE_ID'));
  assert(blocked.missing_configuration.includes('MALWARE_SCANNER_TOKEN'));
  assert.equal(blocked.may_publish, false);
  const text = JSON.stringify(blocked);
  assert.equal(text.includes('secret-value'), false);
});

test('local profile becomes executable with injected keys but never publishable', () => {
  const report = readiness(localProfile(), { VAULT_KEY: true, AUDIT_KEY: true }, '2026-09-30T21:00:00Z');
  assert.equal(report.status, 'ready');
  assert.equal(report.may_deploy, true);
  assert.equal(report.may_publish, false);
});

test('cloudflare binding plan contains no account identifiers or secret values', () => {
  const plan = cloudflareBindings(cloudflareProfile());
  assert.deepEqual({ d1: plan.d1, r2: plan.r2, queue: plan.queueProducer }, { d1: 'DB', r2: 'PRIVATE_ASSETS', queue: 'ASSET_JOBS' });
  assert(plan.requiredSecrets.includes('SESSION_SIGNING_KEY'));
  assert.equal(plan.publication, 'blocked');
});

test('identity adapter verifies role and enforces owner tenant', t => {
  const infrastructure = setup(t);
  assert.equal(infrastructure.identity.verify('owner-token', 'horizonte-casa-demo').actor_id, 'owner-demo');
  assert.throws(() => infrastructure.identity.verify('owner-token', 'otro-negocio-demo'), error => error.code === 'ACCESS_DENIED');
  assert.throws(() => infrastructure.identity.verify('invalid'), error => error.code === 'SESSION_INVALID');
});

test('secret adapter only returns explicitly injected values', t => {
  const infrastructure = setup(t);
  assert.equal(infrastructure.secretStore.get('VAULT_KEY').length, 32);
  assert.throws(() => infrastructure.secretStore.get('UNKNOWN_KEY'), error => error.code === 'SECRET_UNAVAILABLE');
});

test('metadata adapter isolates owner reads by tenant', t => {
  const infrastructure = setup(t);
  infrastructure.database.put('horizonte-casa-demo', 'site-state-demo', { status: 'draft' });
  assert.equal(infrastructure.database.get('horizonte-casa-demo', 'horizonte-casa-demo', 'site-state-demo').value.status, 'draft');
  assert.throws(() => infrastructure.database.get('otro-negocio-demo', 'horizonte-casa-demo', 'site-state-demo'), error => error.code === 'ACCESS_DENIED');
});

test('object adapter quarantines bytes and releases only a clean approved asset', t => {
  const infrastructure = setup(t), bytes = Buffer.from('synthetic image bytes');
  const receipt = infrastructure.objects.quarantine({ tenant_id: 'horizonte-casa-demo', asset_id: 'asset-demo-001', media_type: 'image/jpeg', bytes });
  assert.equal(receipt.status, 'quarantined');
  assert.throws(() => infrastructure.objects.release('horizonte-casa-demo', 'asset-demo-001', { scan_status: 'pending', rights_status: 'approved', active_content_detected: false }), error => error.code === 'ASSET_BLOCKED');
  const released = infrastructure.objects.release('horizonte-casa-demo', 'asset-demo-001', { scan_status: 'clean', rights_status: 'approved', active_content_detected: false });
  assert.equal(released.status, 'released');
  assert.equal(fs.existsSync(path.join(infrastructure.paths.releasedRoot, 'horizonte-casa-demo', 'asset-demo-001.bin')), true);
});

test('object adapter detects quarantine tampering before release', t => {
  const infrastructure = setup(t);
  infrastructure.objects.quarantine({ tenant_id: 'horizonte-casa-demo', asset_id: 'asset-demo-002', media_type: 'image/jpeg', bytes: Buffer.from('original') });
  fs.writeFileSync(path.join(infrastructure.paths.quarantineRoot, 'horizonte-casa-demo', 'asset-demo-002.bin'), 'changed');
  assert.throws(() => infrastructure.objects.release('horizonte-casa-demo', 'asset-demo-002', { scan_status: 'clean', rights_status: 'approved', active_content_detected: false }), error => error.code === 'INTEGRITY_FAILED');
});

test('queue persists, filters by tenant and acknowledges work', t => {
  const infrastructure = setup(t);
  const first = infrastructure.queue.publish('asset.scan.requested', 'horizonte-casa-demo', { asset_id: 'asset-demo-003' });
  infrastructure.queue.publish('asset.scan.requested', 'otro-negocio-demo', { asset_id: 'asset-other-001' });
  assert.deepEqual(infrastructure.queue.pending('horizonte-casa-demo').map(item => item.id), [first.id]);
  assert.equal(infrastructure.queue.ack(first.id).state, 'acknowledged');
  assert.equal(infrastructure.queue.pending('horizonte-casa-demo').length, 0);
});

test('infrastructure console is read-only and isolated', async () => {
  const app = server();
  await new Promise((resolve, reject) => { app.once('error', reject); app.listen(0, '127.0.0.1', resolve); });
  try {
    const origin = `http://127.0.0.1:${app.address().port}`;
    const page = await fetch(origin);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('x-robots-tag'), /noindex/);
    assert.match(page.headers.get('content-security-policy'), /connect-src 'none'/);
    assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
    assert.equal((await fetch(origin + '/missing')).status, 404);
  } finally { await new Promise(resolve => app.close(resolve)); }
});
