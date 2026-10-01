# Runbook de hypercare

## Entrada

Hypercare comienza únicamente después de superar el canary al 100%.

## Checkpoints

| Momento | Comprobación |
|---|---|
| Lanzamiento | Disponibilidad, p95 e incidentes inmediatamente después del canary |
| 24 horas | Tendencia de SLO, colas, rutas, contactos e incidentes |
| 72 horas | Estabilidad sostenida y ausencia de incidentes abiertos |

Los checkpoints se registran en orden. Cada uno se vincula al run, plan y tenant.

## Cierre

Con tres resultados aprobados, el run pasa a `closed` y el freeze se libera. Una brecha o incidente abierto genera rollback en el simulador.

## Responsabilidad humana

En una operación real, el responsable de incidente evalúa impacto, comunicaciones y conveniencia del rollback. El motor no reemplaza esa responsabilidad.
