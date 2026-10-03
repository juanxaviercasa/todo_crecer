# ADR-050 — Evidencia sanitizada y decisión reversible

## Decisión

La evidencia de un proveedor se importa como una entrega declarativa: digest, tipo, origen y modo. Nunca se almacenan valores crudos, secretos ni contactos. Legal y compras deben revisar de forma independiente y la sesión de proveedor debe demostrar alcance `metadata_read` y cero escrituras.

## Reversibilidad

Una decisión humana aprobada produce únicamente un registro reversible y un plan dry-run. El gate no tiene capacidad de aplicar cambios, contratar proveedores, publicar rutas ni enviar mensajes.

## Estado actual

La ejecución incluida es un rehearsal sintético. Por ello el dossier no selecciona candidato y permanece bloqueado hasta recibir evidencia real, sesión real de solo lectura y autorización humana explícita.
