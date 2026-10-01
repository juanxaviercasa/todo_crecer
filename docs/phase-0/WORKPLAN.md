# Phase 0 — Workplan

## Objetivo

Crear los contratos y reglas que impiden que la fábrica genere sitios a partir de datos ambiguos, no trazables o inventados.

## Entregables iniciales

- `contracts/business-truth.schema.json`
- `contracts/vertical-recipe.schema.json`
- `contracts/site-config.schema.json`
- `contracts/brand-profile.schema.json` (añadido)
- `contracts/site-snapshot.schema.json` (añadido)
- `contracts/agent-output.schema.json` (añadido)
- seis contratos de eventos y un esquema de unión (añadidos)
- Golden Business sintético y validación reproducible (añadidos)
- inventario de procedencia del dataset actual
- política publish/noindex
- primer fixture de un negocio real con datos saneados

## Gate de salida

No empezar la fábrica masiva hasta que:
- un `BusinessTruth` real valide;
- cada dato publicable tenga fuente y estado de verificación;
- un `VerticalRecipe` genere un `SiteConfig` válido;
- el SiteConfig imponga `noindex` para demos;
- los campos no confirmados no se conviertan en hechos.

## Estado de esta entrega

La parte de contratos dispone de ejemplos positivos, pruebas de rechazo e integridad
entre documentos. Consultar `VALIDATION.md` para el resultado ejecutado.
**Phase 0 completa sigue pendiente:** no se recibió un dataset real ni evidencia de
procedencia o permisos. El fixture sintético no satisface el gate de negocio real.

Siguiente trabajo: inventariar fuentes del dataset real, registrar derechos y
verificación por campo, sanear un primer negocio y someterlo a revisión humana.
Después implementar el adaptador del motor con datos de secciones tipados,
renderizar, ejecutar QA real y evaluar publicación. Esta entrega no publica nada.
