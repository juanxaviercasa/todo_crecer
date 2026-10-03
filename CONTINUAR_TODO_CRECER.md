# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 47

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 47 implementa FinOps y capacidad multiproveedor: costes por tenant, presupuesto por cohorte, forecast, simulación de picos, arbitraje y límites automáticos simulados. No compra capacidad ni cambia proveedores.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:finops
```

Abrir http://127.0.0.1:4221/.

## Estado comprobado

- 400 contratos JSON Schema.
- 1.376 pruebas aprobadas y 0 fallidas.
- 26 pruebas específicas de la fase 47; 1.508 pruebas acumuladas en la ejecución completa.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- 2 cohorts sintéticas, 4 asignaciones de tenant y 2 proveedores por escenario.
- Forecast base de 1.200 unidades con 108,33% de margen.
- Pico degradado de 4.050 unidades con 1.950 unidades sin capacidad.
- 0 compras, 0 cambios de proveedor y límites únicamente simulados.
- 2 expedientes placeholder y 16 solicitudes obligatorias.
- 13 entregas sanitizadas con renovación programada.
- 8 revisiones de legal, seguridad, finanzas y compras.
- Un expediente con 100% de estructura y 0% de evidencia real.
- 2 riesgos críticos abiertos por candidato.
- Selección final bloqueada y 0 candidatos seleccionados.
- 0 secretos, 0 escrituras, 0 conexiones externas y 0 publicaciones.

## Gate real

La sala está operativa sin candidatos reales. Para habilitar una decisión humana se requieren 8/8 evidencias reales vigentes por candidato, cuatro revisiones aprobadas, cero riesgos críticos y autorización explícita de compras. La completitud placeholder nunca cuenta como evidencia real.

## Fase 48 recomendada

**SLO, observabilidad económica y respuesta automática simulada.** Unificar métricas técnicas y financieras, presupuestos de error, burn rate, anomalías de coste, alertas con deduplicación, runbooks y ensayos de respuesta. Mantener cualquier remediación real bloqueada hasta contar con telemetría productiva, aprobación del operador y controles de rollback.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
