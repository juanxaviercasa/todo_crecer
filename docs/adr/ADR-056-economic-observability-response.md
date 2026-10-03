# ADR-056 — Observabilidad económica y respuesta simulada

## Decisión

La salud operativa debe correlacionar disponibilidad, consumo del presupuesto de error, burn rate en ventanas corta y larga, y desviación de coste. Las señales de un mismo alcance se agrupan mediante una clave estable para evitar incidentes y notificaciones duplicadas.

## Respuesta

Una combinación crítica abre un incidente sintético. El runbook ejecuta cinco pasos en modo simulación: detectar, correlacionar, aplicar un límite seguro, ensayar rollback y verificar. El rollback solo pasa si recupera el SLO y normaliza el coste.

## Límite

El resultado `human_close_review` exige revisión humana. La fase no envía notificaciones, no aplica límites, no ejecuta rollback y no modifica producción.
