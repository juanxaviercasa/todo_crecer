# Configuración necesaria

Los valores se proporcionan mediante el entorno o un gestor de secretos. No deben escribirse en Markdown, JSON, commits, incidencias ni mensajes.

- `CLOUDFLARE_READ_TOKEN`: temporal, solo lectura.
- `CLOUDFLARE_APPLY_TOKEN`: distinto del anterior y limitado al plan.
- `CLOUDFLARE_ACCOUNT_ID`.
- `CLOUDFLARE_ZONE_ID`.
- `STAGING_HOSTNAME`.
- `APPROVED_PLAN_DIGEST`.

`npm run preflight:launch` enumera los nombres ausentes, genera fingerprints cuando están presentes y siempre deja `apply_executed: false`.
