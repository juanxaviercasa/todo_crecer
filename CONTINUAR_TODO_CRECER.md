# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 49

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 49 agrega salud, coste, conversión, evidencia y riesgo de cada negocio. Genera prioridades explicables, colas, asignaciones por capacidad, SLA internos y escalamientos simulados.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:portfolio-command
```

Abrir http://127.0.0.1:4223/.

## Estado comprobado

- 420 contratos JSON Schema.
- 1.376 pruebas aprobadas y 0 fallidas.
- 32 pruebas específicas de la fase 49; 1.569 pruebas acumuladas en la ejecución completa.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- 8 negocios pseudonimizados en una cola priorizada.
- Distribución operativa: 1 P0, 2 P1, 4 P2 y 1 P3.
- 8 asignaciones simuladas y 0 trabajos sin operador.
- 3 SLA internos vencidos y 3 escalamientos simulados.
- 0 notificaciones externas y 0 ejecuciones reales.
- Baseline con 99,98% de disponibilidad, burn normal y coste +3,33%.
- Incidente con 400% del error budget, burn 50×/8× y coste +108,33%.
- 7 ocurrencias deduplicadas en un solo cluster crítico.
- Rollback simulado recuperado a 99,95% con 5/5 checks de integridad.
- 0 notificaciones externas y 0 remediaciones reales.
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

## Fase 50 recomendada

**Certificación integrada y ensayo end-to-end del sistema.** Unificar el estado de los módulos, verificar dependencias y contratos entre fases, ejecutar un recorrido completo de un negocio, ensayar recuperación y producir un dossier go/no-go. Mantener cualquier activación real bloqueada hasta resolver evidencias y aprobaciones pendientes.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
