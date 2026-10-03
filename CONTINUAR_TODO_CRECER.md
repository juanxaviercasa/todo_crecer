# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 36

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 36 implementa contratos de object storage y KMS, referencias de credenciales sin secretos, mínimo privilegio, migración dry-run, canary, rollback, coste, deriva y un expediente de activación con aprobaciones independientes.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:vault-activation
```

Abrir http://127.0.0.1:4210/.

## Estado comprobado

- 281 contratos JSON Schema.
- 1.155 pruebas aprobadas y 0 fallidas.
- 58 pruebas específicas de la fase 36.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- 2 contratos de adaptador simulados: object storage y KMS.
- 2 referencias de identidad y 0 secretos almacenados.
- Política de mínimo privilegio aprobada sin wildcards globales.
- 1.000 objetos sintéticos distribuidos en 10 lotes dry-run.
- Canary 1/5/25/100 planificado.
- Coste permitido y deriva en sincronía.
- Rollback ensayado con resultado aprobado.
- 3 aprobaciones independientes y 8 evidencias selladas.
- `apply` bloqueado, 0 conexiones externas y 0 publicaciones.

## Gate real

El expediente local permite avanzar al preflight externo. Producción permanece bloqueada por tres requisitos: evidencia real del proveedor, credenciales efímeras de producción y una autorización explícita de activación. Ninguna credencial real forma parte del repositorio.

## Fase 37 recomendada

**Laboratorio de conformidad de proveedores y preflight externo de solo lectura.** Crear suites de contrato para candidatos de object storage y KMS, probar capacidades, regiones, cifrado, versionado, lifecycle, rotación y observabilidad mediante transportes falsos; preparar además una sesión efímera de descubrimiento real que solo pueda leer metadatos. El resultado debe ser una matriz de selección y un expediente de preflight, manteniendo escrituras y `apply` bloqueados.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
