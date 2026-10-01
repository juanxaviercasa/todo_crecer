# Fase 7 — base privada de desarrollo

## Componentes ejecutables

### Bóveda

`createFoundation()` cifra cada payload con AES-256-GCM. El registro conserva únicamente metadatos operativos, IV, etiqueta de autenticación, ciphertext y hash del plaintext. El contexto autenticado incluye ID, negocio, tipo y fecha de creación.

Las escrituras usan un archivo temporal exclusivo y un rename atómico. IDs inseguros se rechazan antes de construir rutas.

### Acceso

La matriz local separa cuatro roles:

| Acción | Owner | Operator | Admin | System |
|---|---:|---:|---:|---:|
| Crear registro | Propio | No | Sí | Sí |
| Leer registro | Propio | Sí | Sí | Sí |
| Liberar activo | No | Sí | Sí | Sí |
| Eliminar | No | No | Sí | Sí |
| Evaluar retención | No | No | Sí | Sí |

Una denegación también entra en auditoría. Este RBAC es lógica de dominio; todavía necesita identidades autenticadas emitidas por un proveedor confiable.

### Auditoría

Cada línea contiene secuencia, actor, acción, recurso, resultado, hash anterior, hash propio y firma HMAC-SHA256. `verifyAudit()` detecta cambios, reordenamientos o firmas inválidas.

La firma demuestra posesión de la clave local, pero un sistema productivo necesita custodia externa de secretos, rotación, almacenamiento append-only y exportación de seguridad.

### Retención y eliminación

La evaluación devuelve registros vencidos y excluye `legal_hold`. La eliminación borra el sobre cifrado y conserva una lápida sin payload con ID, tipo, hash, fecha y motivo.

### Cuarentena de activos

`releaseAsset()` solo libera metadatos cuando:

- el análisis declara `clean`;
- no se detecta contenido activo;
- los derechos están `approved`.

La versión actual modela el veredicto. No contiene un motor antivirus ni procesa binarios reales.

## Claves

`keyFromBase64()` exige exactamente 32 bytes. Nunca se incluye una clave de ejemplo en archivos de configuración. Para un entorno remoto se recomienda un KMS con claves separadas para cifrado y auditoría, rotación versionada y acceso limitado a la identidad del servicio.

## Pendientes para producción

1. Proveedor de identidad con MFA y recuperación.
2. Sesiones seguras, CSRF y rate limiting.
3. Base transaccional con aislamiento por tenant.
4. KMS y rotación de claves.
5. Object storage privado con URLs firmadas.
6. Antivirus, validación de tipo real y transformación segura.
7. Auditoría append-only exportada.
8. Políticas legales de retención y respuesta a solicitudes.
