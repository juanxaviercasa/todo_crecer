'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { detectType, dimensions, hasActiveContent, inspectAsset, applyScan, decideRights, registerVariant, revoke, sha256 } = require('../packages/asset-pipeline/index.cjs');
const { server } = require('../scripts/serve-asset-console.cjs');

function png(width = 1800, height = 1200, tail = '') {
  const bytes = Buffer.alloc(32 + Buffer.byteLength(tail));
  Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8); bytes.write('IHDR', 12, 'ascii'); bytes.writeUInt32BE(width, 16); bytes.writeUInt32BE(height, 20);
  if (tail) bytes.write(tail, 32, 'latin1'); return bytes;
}
const baseInput = bytes => ({ asset_id: 'asset-photo-demo', tenant_id: 'horizonte-casa-demo', kind: 'photo', filename: 'fachada.png', declared_type: 'image/png', bytes });
const variant = width => ({ width, media_type: 'image/webp', bytes: 1000 + width, content_sha256: sha256(Buffer.from(`variant-${width}`)), object_key: `horizonte-casa-demo/asset-photo-demo/${width}.webp` });

test('detects PNG from bytes and reads dimensions without trusting extension', () => {
  const bytes = png(2048, 1365);
  assert.equal(detectType(bytes), 'image/png');
  assert.deepEqual(dimensions(bytes, 'image/png'), { width: 2048, height: 1365 });
});

test('rejects mismatch between declared and detected media type', () => {
  const input = { ...baseInput(png()), declared_type: 'image/jpeg' };
  assert.throws(() => inspectAsset(input), error => error.code === 'TYPE_MISMATCH');
});

test('rejects active PDF actions before external scanning', () => {
  const bytes = Buffer.from('%PDF-1.7\n1 0 obj <</OpenAction 2 0 R /JavaScript true>>\n');
  assert.equal(hasActiveContent(bytes, 'application/pdf'), true);
  assert.throws(() => inspectAsset({asset_id:'asset-document-demo',tenant_id:'horizonte-casa-demo',kind:'document',filename:'documento.pdf',declared_type:'application/pdf',bytes}), error => error.code === 'ACTIVE_CONTENT');
});

test('rejects oversized content according to asset kind', () => {
  const bytes = Buffer.alloc(5 * 1024 * 1024 + 1); Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]).copy(bytes); bytes.write('IHDR', 12); bytes.writeUInt32BE(300, 16); bytes.writeUInt32BE(200, 20);
  assert.throws(() => inspectAsset({ ...baseInput(bytes), kind: 'logo' }), error => error.code === 'ASSET_TOO_LARGE');
});

test('quarantines a valid image with no publish capability', () => {
  const record = inspectAsset(baseInput(png()), '2026-09-30T22:00:00Z');
  assert.equal(record.state, 'quarantined'); assert.equal(record.publishable, false); assert.equal(record.scan.status, 'pending');
});

test('failed scan stays quarantined and malicious scan is rejected', () => {
  const record = inspectAsset(baseInput(png()));
  assert.equal(applyScan(record, { status: 'failed', provider: 'synthetic-scanner' }).state, 'quarantined');
  assert.equal(applyScan(record, { status: 'malicious', provider: 'synthetic-scanner' }).state, 'rejected');
});

test('clean scan still waits for explicit rights approval', () => {
  const record = inspectAsset(baseInput(png()));
  const scanned = applyScan(record, { status: 'clean', provider: 'synthetic-scanner' });
  assert.equal(scanned.state, 'awaiting_rights'); assert.equal(scanned.publishable, false);
});

test('photo becomes web-ready only after every required responsive variant', () => {
  let record = inspectAsset(baseInput(png()));
  record = applyScan(record, { status: 'clean', provider: 'synthetic-scanner' });
  record = decideRights(record, 'approved', 'Permiso sintético para pruebas.');
  assert.equal(record.state, 'awaiting_variants');
  record = registerVariant(record, variant(480)); record = registerVariant(record, variant(960));
  assert.equal(record.publishable, false);
  record = registerVariant(record, variant(1600));
  assert.equal(record.state, 'web_ready'); assert.equal(record.publishable, true);
});

test('variant registration is blocked before security and rights gates', () => {
  const record = inspectAsset(baseInput(png()));
  assert.throws(() => registerVariant(record, variant(480)), error => error.code === 'ASSET_BLOCKED');
});

test('rights rejection is terminal for the current review path', () => {
  const record = decideRights(inspectAsset(baseInput(png())), 'rejected', 'Sin autorización suficiente.');
  assert.equal(record.state, 'rejected'); assert.equal(record.publishable, false);
});

test('revocation immediately removes publish capability and prevents later mutation', () => {
  let record = inspectAsset(baseInput(png()));
  record = revoke(record, 'Solicitud verificada del propietario.', '2026-10-01T00:00:00Z');
  assert.equal(record.state, 'revoked'); assert.equal(record.publishable, false);
  assert.throws(() => applyScan(record, { status: 'clean', provider: 'synthetic-scanner' }), error => error.code === 'ASSET_REVOKED');
});

test('asset console is read-only and isolated', async () => {
  const app = server(); await new Promise((resolve, reject) => { app.once('error', reject); app.listen(0, '127.0.0.1', resolve); });
  try {
    const origin = `http://127.0.0.1:${app.address().port}`;
    const page = await fetch(origin); assert.equal(page.status, 200); assert.match(page.headers.get('x-robots-tag'), /noindex/); assert.match(page.headers.get('content-security-policy'), /connect-src 'none'/);
    assert.equal((await fetch(origin, { method: 'POST' })).status, 405); assert.equal((await fetch(origin + '/missing')).status, 404);
  } finally { await new Promise(resolve => app.close(resolve)); }
});
