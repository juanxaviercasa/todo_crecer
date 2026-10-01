# ADR-031 — Orquestación durable y reconciliación

## Estado

Aceptado para la implementación local sintética de la Fase 23.

## Contexto

El gobierno de flota determina qué debe cambiar, pero ejecutar miles de operaciones exige controlar duplicados, concurrencia, fallos parciales, reintentos y capacidad. Una llamada directa desde la consola de gobierno no preservaría esas garantías.

## Decisión

Separar intención, observación, plan y trabajo. El reconciler compara el estado deseado con el observado y genera operaciones idempotentes. Los workers reclaman trabajos mediante leases temporales. Ventanas, concurrencia y presupuesto se verifican al reclamar, no sólo al encolar. Los fallos transitorios usan backoff; los terminales entran en dead-letter y requieren replay explícito.

La implementación inicial es local y `dry_run`. No ejecuta adaptadores externos ni actualiza el estado observado automáticamente.

## Consecuencias

- Repetir una reconciliación no duplica trabajos.
- Un sitio admite como máximo el número configurado de operaciones concurrentes.
- La caída de un worker se recupera al expirar su lease.
- El presupuesto puede detener claims sin perder la cola.
- Los fallos terminales quedan visibles y auditables.
