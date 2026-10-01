# Idempotencia y cola

La clave tiene el formato conceptual `reconcile:<site>:g<generation>:<operation>`. El registro conserva el digest de la solicitud y el trabajo original durante 30 días.

- Misma clave y mismo digest: devuelve el trabajo existente.
- Misma clave y otro digest: conflicto y rechazo.
- Un replay desde dead-letter utiliza una clave nueva y trazable.

La cola ordena por prioridad y antigüedad. El encolado no consume presupuesto: el consumo ocurre cuando un worker reclama el trabajo. Esto permite conservar intención pendiente mientras una ventana está cerrada o el presupuesto está agotado.
