# ADR-052 — Activación canary del proveedor

## Decisión

Toda activación de proveedor comienza con metadatos sintéticos y cuatro etapas fijas: 5%, 25%, 50% y 100%. El plan requiere baseline de integridad, política SLO, presupuesto permitido y aprobaciones independientes de seguridad y plataforma.

## Guardrails

Cada etapa mide disponibilidad, latencia p95, tasa de error e integridad. Un incumplimiento detiene el recorrido y crea un rollback automático que restaura el origen y revoca el destino. La observación y el rollback no realizan cambios externos durante el rehearsal.

## Límite

El dossier canary no concede capacidad de apply. La activación real requiere el expediente completo de fase 43 y una autorización final separada.
