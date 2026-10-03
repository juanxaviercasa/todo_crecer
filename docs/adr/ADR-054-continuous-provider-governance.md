# ADR-054 — Gobierno continuo del proveedor

## Decisión

Cada proveedor debe pasar una revisión trimestral que combine desempeño, evidencia vigente, SLA, coste, rotación de credenciales y capacidad de sustitución. Los resultados se registran en una cadena de auditoría sin secretos.

## Sustitución

El plan de sustitución se mantiene siempre preparado en modo dry-run. Un score bajo, SLA incumplido, sobrecoste o evidencia vencida cambia el plan a `review_required` y la revisión trimestral a `replacement_review`.

## Límite

El ciclo actual usa datos sintéticos. La decisión `continue_conditional` no habilita operaciones reales y la rotación simulada no persiste material de claves.
