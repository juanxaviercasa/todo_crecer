# ADR-057 — Centro de mando y priorización del portafolio

## Decisión

Cada negocio produce un snapshot pseudonimizado con cinco dimensiones. La prioridad se calcula con pesos explícitos: riesgo 30%, brecha de salud 25%, evidencia 20%, conversión 15% y coste 10%.

Cada score genera un trabajo con rol requerido y SLA interno. La asignación respeta capacidad y especialidad; los incumplimientos solo generan escalamientos simulados.

## Gate

Una prioridad P0 fuerza `hold_critical`. Las asignaciones no contactan negocios, no modifican sitios y no notifican operadores reales. La ejecución requiere telemetría real, directorio autorizado y aprobación operativa.
