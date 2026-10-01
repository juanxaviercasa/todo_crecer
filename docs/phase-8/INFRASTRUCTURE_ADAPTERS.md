# Fase 8: adaptadores de infraestructura

## Resultado

La plataforma dispone de una frontera verificable entre el dominio y la infraestructura. El mismo flujo puede usar implementaciones locales durante desarrollo y adaptadores administrados cuando exista un entorno autorizado.

## Puertos

| Puerto | Desarrollo local | Perfil productivo |
|---|---|---|
| Identidad | sesiones inyectadas en memoria | Cloudflare Access en el perímetro y sesión propia vinculada a principal/tenant |
| Metadatos | JSON atómico, solo para fixtures | D1 con migraciones y consultas siempre limitadas por `tenant_id` |
| Claves | valores inyectados al proceso | Workers Secrets y rotación versionada |
| Objetos | carpetas privadas de cuarentena/liberados | buckets o prefijos R2 privados |
| Cola | JSONL local | Cloudflare Queues con reintentos y cola de errores |
| Antimalware | denegación hasta veredicto explícito | proveedor externo detrás del adaptador |

## Implementación ejecutable

`packages/infrastructure-adapters/index.cjs` implementa:

- carga y validación de perfiles;
- informe de configuración faltante que nunca copia valores;
- sesiones por rol y límite del propietario a su negocio;
- metadatos locales con escritura atómica;
- cuarentena binaria, SHA-256, veredicto y promoción;
- cola persistente, filtrada por tenant y con confirmación;
- lectura de secretos solo desde un objeto inyectado.

El adaptador de metadatos local no debe recibir contenido privado. Ese contenido continúa en la bóveda cifrada de Fase 7. Su finalidad es probar estados, referencias y aislamiento.

## Perfil Cloudflare

El archivo `infra/cloudflare/wrangler.example.jsonc` sigue la estructura JSONC recomendada actualmente por Cloudflare y declara bindings para D1, R2 y Queues, además de los nombres de secretos obligatorios. Es una plantilla: contiene marcadores y `workers_dev: false`.

La migración `0001_private_platform.sql` crea tenants, principales, membresías, referencias de registros privados, activos y auditoría. No almacena cuerpos privados sin cifrar.

Cloudflare indica que los secretos no deben guardarse en `vars`; el ejemplo declara sus nombres y excluye `.dev.vars` reales mediante `.gitignore`. Access protege el perímetro, pero la aplicación todavía debe validar la identidad y aplicar autorización por tenant. Referencias: [configuración de Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/), [validación JWT de Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/) y [Cloudflare Queues](https://developers.cloudflare.com/queues/get-started/).

## Límites actuales

- No existe un Worker productivo ni adaptadores remotos implementados.
- No se han creado D1, R2, Queue, Access ni secretos.
- Falta un escritor único para secuenciar la cadena de auditoría bajo concurrencia.
- Falta seleccionar e integrar el escáner antimalware.
- No hay monitorización, copias de seguridad, recuperación ni rollback ensayado.
- Ningún informe de esta fase habilita publicación.

Estos límites son bloqueos explícitos del despliegue, no tareas ocultas.
