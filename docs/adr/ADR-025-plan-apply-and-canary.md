# ADR-025 — Separación plan/apply y canary obligatorio

## Estado

Aceptada para la Fase 17.

## Contexto

El control de publicación decide qué release debe estar activo, pero una integración con Cloudflare introduce operaciones externas sobre Worker, R2, D1, colas, hostnames y caché. Una decisión local no debe convertirse de forma implícita en cambios remotos.

## Decisión

Cada despliegue produce primero un `CloudflareDeploymentPlan` cerrado. Otro operador lo aprueba. El preflight confirma únicamente presencia de configuración y nunca devuelve valores. `dry_run` utiliza un adaptador sin red y registra cero cambios externos. `apply` requiere un adaptador diferente y permanece bloqueado en esta entrega.

Después de aplicar, el tráfico avanza por 5%, 25%, 50% y 100%. Cada etapa comprueba HTTP 200, latencia máxima de 2000 ms, digest, cabeceras de seguridad y política `noindex` en staging. Cualquier fallo interrumpe la progresión y exige rollback.

## Consecuencias

- Revisar un plan no concede por sí mismo permiso para ejecutarlo.
- Los valores secretos no forman parte de contratos, informes ni logs.
- Los fallos pueden ensayarse antes de conectar una cuenta.
- El Worker usa bindings y rutas por tenant, evitando deployments independientes por negocio.
