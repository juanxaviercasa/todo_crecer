# Fase 17 — Cloudflare staging

## Arquitectura

El plan contiene seis recursos lógicos: Worker, artefactos R2, rutas D1, cola, Custom Hostname y caché. Las dependencias determinan el orden, pero no incluyen identificadores de cuenta ni credenciales.

Los artefactos se almacenarán bajo `tenants/<tenant>/builds/<build>/`. El Worker consulta una ruta activa por hostname y obtiene exclusivamente el objeto del tenant/build resuelto. Antes de responder, el adaptador comprobable valida SHA-256 y añade CSP, `nosniff`, política de referencia, `X-Robots-Tag` y `X-Release-Id`.

## Preflight

Las ocho entradas externas se manejan por nombre:

- `CF_ACCOUNT_ID`
- `CF_ZONE_ID`
- `CF_API_TOKEN`
- `CF_R2_BUCKET_NAME`
- `CF_D1_DATABASE_ID`
- `CF_QUEUE_NAME`
- `CF_CUSTOM_HOSTNAMES_ENABLED`
- `CF_HEALTH_ENDPOINT`

El informe solo indica presente, ausente o simulado. Nunca copia valores.

La plantilla utiliza el binding `env.DB`, un prepared statement con parámetros y `first()` para D1. Para R2 usa el binding `env.SITE_ARTIFACTS`, `get()` y `writeHttpMetadata()`. Estas formas fueron contrastadas con la documentación oficial de Cloudflare vigente el 30 de septiembre de 2026.

## Canary

El escenario correcto completa 5/25/50/100. El escenario negativo inyecta un digest incorrecto al 25%, detiene el avance y marca todas las operaciones como revertidas. Ambos casos son locales.

En un dominio personalizado real, el canary no debe empezar hasta que el hostname tenga estado `active`, su certificado tenga `ssl.status: active` y el DNS apunte al objetivo SaaS. La propiedad del hostname y la validación del certificado son verificaciones diferentes.

## Límite

El Worker es una plantilla revisable y el archivo Wrangler contiene placeholders. No se han creado recursos, subido artefactos ni consultado APIs externas.
