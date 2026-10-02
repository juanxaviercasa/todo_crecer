# ADR-042: Evidencia privada y sustitución controlada de fixtures

**Estado:** Aceptado · **Fecha:** 2026-10-02

La fase 34 procesa evidencia antes de permitir cambios: clasificación, minimización, cifrado AES-256-GCM, revisión independiente de privacidad y negocio, vencimiento y cadena de custodia. Las claves no se persisten junto al expediente y el contenido crudo desaparece después de la redacción.

El ensayo solo sustituye fixtures sintéticos. Un paquete de evidencia real seguirá siendo privado y no habilitará publicación por sí mismo.
