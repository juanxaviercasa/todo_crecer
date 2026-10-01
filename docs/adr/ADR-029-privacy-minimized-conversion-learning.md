# ADR-029: aprendizaje de conversión con datos mínimos

## Estado

Aceptado para la Fase 21.

## Decisión

La plataforma medirá etapas de conversión mediante una taxonomía cerrada y buckets efímeros. Se rechazan campos adicionales, incluidos identificadores, contacto, IP, user agent, URL completa, query y contenido del lead.

Los experimentos fijan muestra, uplift y guardrails antes de evaluar resultados. Una mejora aparente no es accionable si falta muestra o empeoran Web Vitals o incidentes.

El aprendizaje produce propuestas revisables. Ningún resultado actualiza recetas o sitios automáticamente.
