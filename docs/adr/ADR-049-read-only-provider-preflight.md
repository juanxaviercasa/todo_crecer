# ADR-049 — Preflight de proveedor en solo lectura

## Decisión

La selección de proveedor comienza con sondas de metadatos en modo read-only. Cada sesión almacena únicamente una huella de credencial, tiene alcance cerrado y registra cero escrituras. Términos, residencia, cifrado, ciclo de vida, rotación, observabilidad y coste se evalúan como evidencia separada.

## Límites

La fase 41 usa adaptadores sintéticos. No contrata, modifica, migra, publica ni contacta a ningún proveedor. La elegibilidad técnica no equivale a autorización de compras ni a aceptación legal.

## Gate posterior

Se requieren evidencia suministrada por el operador, sesión real de solo lectura, revisión de términos, aprobación de compras y autorización humana de salida antes de cualquier aplicación.
