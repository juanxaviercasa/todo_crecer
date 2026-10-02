# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 35

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 35 implementa una bóveda operativa ensayada con datos sintéticos. Controla cifrado, claves separadas, acceso temporal, exportación marcada, revocación, retención, legal hold, destrucción verificable, backup, recuperación y auditoría encadenada.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:vault
```

Abrir http://127.0.0.1:4209/.

## Estado comprobado

- 269 contratos JSON Schema.
- 1.097 pruebas aprobadas y 0 fallidas.
- 59 pruebas específicas de la fase 35.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- 2 objetos sintéticos cifrados con AES-256-GCM.
- 1 acceso temporal de un solo uso y 1 exportación marcada.
- 1 revocación comprobada.
- 1 legal hold ensayado y liberado.
- 1 recuperación íntegra después de pérdida simulada.
- 1 destrucción verificada de ciphertext, clave y backup.
- Cadena de auditoría válida.
- 0 claves persistidas, 0 conexiones externas y 0 publicaciones.

## Gate real

El comportamiento está probado localmente. Producción permanece bloqueada hasta configurar un object store cifrado, un KMS externo, identidades de servicio de mínimo privilegio, rotación de claves, backup separado y observabilidad operativa. Ninguna credencial real forma parte del repositorio.

## Fase 36 recomendada

**Adaptadores de producción y ceremonia de activación sellada.** Definir los contratos de object storage y KMS, comprobar permisos de mínimo privilegio, inyectar credenciales fuera del repositorio, ejecutar migración dry-run, canary y rollback, medir coste y deriva, y producir un expediente de aprobación. La fase debe mantener `apply` bloqueado hasta una autorización explícita y verificable.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
