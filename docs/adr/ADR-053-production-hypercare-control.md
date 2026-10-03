# ADR-053 — Control de producción e hipercuidado

## Decisión

El paso posterior al canary requiere un freeze explícito, aprobaciones independientes de seguridad y plataforma y una autorización final de un solo uso con duración máxima de 15 minutos. La autorización se almacena mediante hash y queda ligada al digest del freeze.

## Hipercuidado

La telemetría usa un esquema cerrado, agregado y sin PII. Los checkpoints se revisan en 0, 1, 4 y 24 horas. Disponibilidad, latencia, error o integridad fuera de umbral provocan revocación inmediata, congelamiento de ruta y rollback.

## Límite

El rehearsal no aplica cambios externos. Tanto el camino sano como el degradado terminan en un cierre verificable con cero escrituras y publicaciones.
