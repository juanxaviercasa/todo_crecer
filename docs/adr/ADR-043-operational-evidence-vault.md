# ADR-043: Bóveda operativa y ciclo de vida de evidencia

**Estado:** Aceptado · **Fecha:** 2026-10-02

La fase 35 introduce interfaces separadas para almacenamiento y claves. El ensayo usa memoria local y claves efímeras; producción permanecerá bloqueada hasta conectar object storage cifrado y KMS externo.

Todo acceso es temporal, de alcance mínimo y trazable. Las exportaciones se marcan, la revocación es inmediata y la destrucción exige ausencia comprobada de blob, clave y backup.
