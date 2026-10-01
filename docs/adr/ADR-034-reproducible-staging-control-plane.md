# ADR-034 — Staging reproducible y promoción firmada

## Estado

Aceptado para la implementación sintética de la Fase 26.

## Contexto

Los componentes aislados ya tienen contratos, persistencia e identidad. Aún falta demostrar que pueden provisionarse, observarse, promoverse y retirarse como un sistema completo sin depender de pasos manuales invisibles.

## Decisión

Representar staging mediante un grafo de recursos declarativos. El plan ordena dependencias, se vincula a un preflight y presupuesto aprobados y obtiene un digest inmutable. El adaptador es la única frontera capaz de producir cambios externos.

Una promoción exige attestation del artefacto y aprobación independiente. Después ejecuta smoke tests cerrados. El rollback y teardown también requieren aprobación y usan el orden inverso de dependencias. Los recursos compartidos o de retención no se destruyen.

## Consecuencias

- El escenario completo puede ensayarse sin una cuenta Cloudflare.
- Un ciclo o dependencia ausente bloquea el plan.
- El hard stop de presupuesto impide ejecución.
- El inventario compara digests sin leer secretos.
- El adaptador externo permanece bloqueado hasta configurar y aprobar staging real.
