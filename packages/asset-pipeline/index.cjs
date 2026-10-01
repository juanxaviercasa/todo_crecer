'use strict';

const crypto = require('node:crypto');
const { validate } = require('../site-engine/index.cjs');

const TYPES = Object.freeze({ png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp', pdf: 'application/pdf', mp4: 'video/mp4' });
const LIMITS = Object.freeze({ logo: 5 * 1024 * 1024, photo: 12 * 1024 * 1024, document: 15 * 1024 * 1024, video: 25 * 1024 * 1024 });
const REQUIRED_WIDTHS = Object.freeze({ logo: [160, 320], photo: [480, 960, 1600] });
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const clone = value => structuredClone(value);

function fail(message, code) { throw Object.assign(new Error(message), { code }); }
function safeId(value, label) { if (!/^[a-z0-9][a-z0-9-]{2,100}$/.test(String(value || ''))) fail(`Unsafe ${label}`, 'ID_UNSAFE'); return String(value); }

function detectType(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 8) return null;
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return TYPES.png;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return TYPES.jpeg;
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return TYPES.webp;
  if (bytes.subarray(0, 5).toString('ascii') === '%PDF-') return TYPES.pdf;
  if (bytes.length >= 12 && bytes.subarray(4, 8).toString('ascii') === 'ftyp') return TYPES.mp4;
  return null;
}

function pngDimensions(bytes) {
  if (bytes.length < 24 || bytes.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function jpegDimensions(bytes) {
  let offset = 2;
  while (offset + 8 < bytes.length) {
    while (offset < bytes.length && bytes[offset] !== 0xff) offset++;
    while (offset < bytes.length && bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > bytes.length) break;
    const size = bytes.readUInt16BE(offset);
    if (size < 2 || offset + size > bytes.length) break;
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker) && size >= 7) {
      return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
    }
    offset += size;
  }
  return null;
}

function webpDimensions(bytes) {
  if (bytes.length < 30) return null;
  const chunk = bytes.subarray(12, 16).toString('ascii');
  if (chunk === 'VP8X') return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) };
  return null;
}

function dimensions(bytes, mediaType) {
  if (mediaType === TYPES.png) return pngDimensions(bytes);
  if (mediaType === TYPES.jpeg) return jpegDimensions(bytes);
  if (mediaType === TYPES.webp) return webpDimensions(bytes);
  return null;
}

function hasActiveContent(bytes, mediaType) {
  const sample = bytes.subarray(0, Math.min(bytes.length, 1024 * 1024)).toString('latin1').toLowerCase();
  const pdf = ['/javascript', '/openaction', '/launch', '/embeddedfile', '/richmedia'];
  // Raster formats may legitimately carry C2PA metadata containing SVG icons.
  // They are served with an allowlisted image MIME and nosniff; PDF actions are
  // the active constructs this preflight can identify without a full decoder.
  return mediaType === TYPES.pdf && pdf.some(marker => sample.includes(marker));
}

function inspectAsset(input, now = new Date().toISOString()) {
  const assetId = safeId(input.asset_id, 'asset identifier');
  const tenantId = safeId(input.tenant_id, 'tenant identifier');
  if (!['logo', 'photo', 'video', 'document'].includes(input.kind)) fail('Unsupported asset kind', 'KIND_UNSUPPORTED');
  if (!Buffer.isBuffer(input.bytes) || input.bytes.length === 0) fail('Asset bytes required', 'ASSET_EMPTY');
  if (input.bytes.length > LIMITS[input.kind]) fail('Asset exceeds kind limit', 'ASSET_TOO_LARGE');
  if (!/^[^/\\]{1,240}$/.test(String(input.filename || ''))) fail('Unsafe filename', 'FILENAME_UNSAFE');
  const detected = detectType(input.bytes);
  if (!detected) fail('Unknown binary signature', 'TYPE_UNKNOWN');
  if (detected !== input.declared_type) fail('Declared and detected types differ', 'TYPE_MISMATCH');
  const imageKind = ['logo', 'photo'].includes(input.kind);
  if (imageKind && !detected.startsWith('image/')) fail('Image kind requires image bytes', 'KIND_TYPE_MISMATCH');
  if (input.kind === 'video' && detected !== TYPES.mp4) fail('Video kind requires MP4 bytes', 'KIND_TYPE_MISMATCH');
  if (input.kind === 'document' && detected !== TYPES.pdf) fail('Document kind requires PDF bytes', 'KIND_TYPE_MISMATCH');
  if (hasActiveContent(input.bytes, detected)) fail('Active content marker detected', 'ACTIVE_CONTENT');
  const measured = dimensions(input.bytes, detected);
  if (imageKind && (!measured || measured.width < 1 || measured.height < 1 || measured.width > 12000 || measured.height > 12000)) fail('Image dimensions unavailable or outside limits', 'DIMENSIONS_INVALID');
  const record = {
    schema_version: '0.1.0', asset_id: assetId, tenant_id: tenantId, kind: input.kind,
    filename: input.filename, declared_type: input.declared_type, detected_type: detected,
    bytes: input.bytes.length, content_sha256: sha256(input.bytes), dimensions: measured,
    inspection: { signature_valid: true, active_content_detected: false },
    scan: { status: 'pending', provider: null, checked_at: null },
    rights: { status: 'pending_review', permission_note: null }, variants: [],
    state: 'quarantined', publishable: false, created_at: now, updated_at: now, revocation: null
  };
  validate('asset-processing-record', record); return record;
}

function applyScan(record, result, now = new Date().toISOString()) {
  const next = clone(record); validate('asset-processing-record', next);
  if (next.state === 'revoked') fail('Revoked asset is immutable', 'ASSET_REVOKED');
  if (!['clean', 'malicious', 'failed'].includes(result.status) || !result.provider) fail('Scanner verdict invalid', 'SCAN_INVALID');
  next.scan = { status: result.status, provider: String(result.provider).slice(0, 100), checked_at: now };
  if (result.status === 'malicious') next.state = 'rejected';
  else if (result.status === 'failed') next.state = 'quarantined';
  else if (next.rights.status !== 'approved') next.state = 'awaiting_rights';
  else next.state = REQUIRED_WIDTHS[next.kind] ? 'awaiting_variants' : 'ready_private';
  next.publishable = false; next.updated_at = now;
  validate('asset-processing-record', next); return next;
}

function decideRights(record, decision, note, now = new Date().toISOString()) {
  const next = clone(record); validate('asset-processing-record', next);
  if (next.state === 'revoked') fail('Revoked asset is immutable', 'ASSET_REVOKED');
  if (!['approved', 'rejected'].includes(decision) || !note || String(note).length < 5) fail('Rights decision invalid', 'RIGHTS_INVALID');
  next.rights = { status: decision, permission_note: String(note).slice(0, 1000) };
  if (decision === 'rejected') next.state = 'rejected';
  else if (next.scan.status !== 'clean') next.state = 'quarantined';
  else next.state = REQUIRED_WIDTHS[next.kind] ? 'awaiting_variants' : 'ready_private';
  next.publishable = false; next.updated_at = now;
  validate('asset-processing-record', next); return next;
}

function registerVariant(record, variant, now = new Date().toISOString()) {
  const next = clone(record); validate('asset-processing-record', next);
  if (next.state === 'revoked') fail('Revoked asset is immutable', 'ASSET_REVOKED');
  if (next.scan.status !== 'clean' || next.rights.status !== 'approved') fail('Asset gates incomplete', 'ASSET_BLOCKED');
  const required = REQUIRED_WIDTHS[next.kind]; if (!required) fail('Asset does not support web variants', 'VARIANT_UNSUPPORTED');
  if (!required.includes(variant.width)) fail('Unexpected variant width', 'VARIANT_INVALID');
  const clean = { width: variant.width, media_type: variant.media_type, bytes: variant.bytes, content_sha256: variant.content_sha256, object_key: variant.object_key };
  next.variants = next.variants.filter(item => item.width !== clean.width); next.variants.push(clean); next.variants.sort((a,b) => a.width - b.width);
  const complete = required.every(width => next.variants.some(item => item.width === width));
  next.state = complete ? 'web_ready' : 'awaiting_variants'; next.publishable = complete; next.updated_at = now;
  validate('asset-processing-record', next); return next;
}

function revoke(record, reason, now = new Date().toISOString()) {
  const next = clone(record); validate('asset-processing-record', next);
  if (!reason || String(reason).length < 5) fail('Revocation reason required', 'REVOCATION_REASON_REQUIRED');
  next.state = 'revoked'; next.publishable = false; next.revocation = { reason: String(reason).slice(0, 500), revoked_at: now }; next.updated_at = now;
  validate('asset-processing-record', next); return next;
}

module.exports = { TYPES, LIMITS, REQUIRED_WIDTHS, detectType, dimensions, hasActiveContent, inspectAsset, applyScan, decideRights, registerVariant, revoke, sha256 };
