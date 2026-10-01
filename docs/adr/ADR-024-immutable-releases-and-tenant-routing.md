# ADR-024 — Releases inmutables y routing por tenant

## Estado

Aceptada para implementación local en la Fase 16.

## Contexto

El motor ya puede generar, revisar y autorizar sitios, pero publicar miles de deployments independientes elevaría el coste operativo y haría más difícil el rollback. Además, un build aprobado no debe alterar una ruta por sí solo.

## Decisión

Se separan cinco objetos:

1. `PublicationBuild` registra el snapshot y digest del artefacto.
2. `DomainBinding` acredita que un hostname puede usarse para un tenant.
3. `TenantRoute` resuelve hostname y path hacia un release activo.
4. `PublicationRelease` conserva cada promoción o rollback de forma inmutable.
5. `CachePurgeRequest` registra la invalidación como operación idempotente.

El cambio visible se reduce a mover `active_release_id` dentro de una ruta después de pasar los gates. El rollback crea otro release que apunta a un build histórico aprobado. No modifica ni elimina releases anteriores.

## Consecuencias

- Un sitio puede volver a una versión conocida sin reconstruirla.
- Las rutas quedan aisladas por tenant, sitio y entorno.
- Revocar el build o dominio activo suspende la ruta.
- El proveedor de DNS, Custom Hostnames y caché permanece detrás de un adaptador.
- La implementación local no demuestra consistencia transaccional distribuida ni disponibilidad en producción.
