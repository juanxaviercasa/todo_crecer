# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 40

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 40 implementa un ensayo local de portabilidad y salida de proveedor: exportación neutral, reenvoltura de claves, integridad, RTO/RPO, coste, failover, rollback y destrucción simulada en origen. No realiza cambios externos.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:portability
```

Abrir http://127.0.0.1:4214/.

## Estado comprobado

- 337 contratos JSON Schema.
- 1.376 pruebas aprobadas y 0 fallidas.
- 46 pruebas específicas de la fase 40.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- 2 expedientes placeholder y 16 solicitudes obligatorias.
- 13 entregas sanitizadas con renovación programada.
- 8 revisiones de legal, seguridad, finanzas y compras.
- Un expediente con 100% de estructura y 0% de evidencia real.
- 2 riesgos críticos abiertos por candidato.
- Selección final bloqueada y 0 candidatos seleccionados.
- 0 secretos, 0 escrituras, 0 conexiones externas y 0 publicaciones.

## Gate real

La sala está operativa sin candidatos reales. Para habilitar una decisión humana se requieren 8/8 evidencias reales vigentes por candidato, cuatro revisiones aprobadas, cero riesgos críticos y autorización explícita de compras. La completitud placeholder nunca cuenta como evidencia real.

## Fase 41 recomendada

**Preflight real de salida y continuidad controlada.** Cuando exista un proveedor candidato y autorización explícita, ejecutar únicamente descubrimiento de solo lectura, cotejo de términos y evidencia de residencia, sin aplicar migración. Después repetir el ensayo con manifiesto real sanitizado, aprobación humana de salida y un plan de destrucción reversible.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
