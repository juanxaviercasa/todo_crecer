# ADR-035 — Activación Cloudflare con clientes separados

## Estado

Aceptado para la Fase 27. Apply externo continúa sin ejecutar.

## Contexto

Un único cliente con permisos de lectura y escritura permite que discovery, errores o scripts auxiliares produzcan cambios accidentales. También dificulta demostrar qué plan exacto fue aprobado.

## Decisión

Usar sesiones separadas `read` y `apply`. La primera sólo admite GET y genera permisos, inventario y rate-limit evidence. La segunda requiere un plan con digest, tres aprobaciones por rol, autorización breve y nonce de un solo uso.

Los tokens sólo viven en memoria. Los registros conservan fingerprints. Cada request de escritura genera un recibo con endpoint redactado, digests e idempotency hash.

## Consecuencias

- Discovery no puede mutar recursos.
- Cambiar el plan invalida approvals y autorización.
- Apply no puede repetirse con el mismo nonce.
- Las credenciales reales siguen siendo necesarias para importar el inventario de cuenta.
- El workflow entregado mantiene apply desactivado.
