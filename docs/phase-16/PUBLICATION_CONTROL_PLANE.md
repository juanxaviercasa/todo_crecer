# Fase 16 — Publication Control Plane

## Objetivo

Convertir un build aprobado en una decisión de publicación trazable y reversible. Esta fase implementa el dominio y el flujo local; no configura infraestructura pública.

## Flujo

1. Un operador registra el build mediante su `snapshot_id`, digest y entrypoint.
2. Un segundo operador lo aprueba. El registrador no puede aprobar su propio build.
3. El adaptador verifica o reserva el hostname.
4. Se crea una ruta compatible con tenant, site y entorno.
5. La promoción exige build aprobado, QA `passed`, binding listo y un snapshot de capacidades con `site.publish` permitido.
6. El release activo anterior queda `superseded` y la ruta apunta al nuevo release.
7. Una purga idempotente retira contenido anterior cuando el adaptador real exista.

## Invariantes

- Los builds y releases tienen identificadores únicos.
- Un hostname y path solo pueden corresponder a una ruta viva.
- Los subdominios gestionados terminan en `.guialima.online`.
- Los dominios personalizados requieren verificación y certificado listos.
- El permiso debe pertenecer al mismo tenant.
- Un build revocado o dominio revocado suspende la ruta afectada.
- Un rollback crea un release nuevo; el historial previo no se reescribe.
- Una clave idempotente impide duplicar purgas.
- El adaptador sin configurar falla cerrado.

## Límites actuales

El almacenamiento está en memoria durante las pruebas y el proveedor es `local_sandbox`. La migración D1 describe la persistencia prevista, pero no ha sido aplicada a una cuenta. No hay propagación DNS, certificados, uploads a R2, Workers, Durable Objects ni purgas reales.

## Paso para producción

La conexión externa requerirá una zona autorizada, IDs de cuenta y recursos, secretos fuera del repositorio, estrategia transaccional, observabilidad, límites por tenant y un negocio colaborador con build aprobado. Cada entrada debe pasar por el preflight antes de habilitar el adaptador Cloudflare.
