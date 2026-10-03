# ADR-044: Adaptadores de producción y activación sellada

**Estado:** Aceptado · **Fecha:** 2026-10-02

La fase 36 define contratos separados para object storage y KMS. Las credenciales solo se representan mediante referencias y huellas. El ensayo valida permisos, migración, coste, deriva, canary, rollback y aprobaciones sin conectarse a servicios externos.

El expediente permite avanzar al preflight externo, pero no autoriza apply. La activación real exige evidencia del proveedor, credenciales efímeras y autorización explícita posterior.
