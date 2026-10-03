# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 39

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 39 implementa una sala de incorporación y decisión con placeholders explícitos, ocho solicitudes obligatorias, renovación, términos, costes, revisiones independientes, riesgos y selección humana bloqueada.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:decision-room
```

Abrir http://127.0.0.1:4213/.

## Estado comprobado

- 318 contratos JSON Schema.
- 1.330 pruebas aprobadas y 0 fallidas.
- 58 pruebas específicas de la fase 39.
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

## Fase 40 recomendada

**Portabilidad, continuidad y ensayo de salida del proveedor.** Definir un formato neutral de exportación, reenvoltura de claves, verificación de integridad, migración entre adaptadores, RTO/RPO, coste de salida, eliminación verificable en origen y rollback. Todo debe ensayarse con dos proveedores simulados para demostrar que una futura elección no encierra el sistema en un único proveedor.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
