# ADR-045: Conformidad de proveedores y preflight read-only

**Estado:** Aceptado · **Fecha:** 2026-10-02

La fase 37 compara combinaciones de object storage y KMS mediante una suite común. Los candidatos incluidos son fixtures sintéticos y no representan afirmaciones sobre proveedores comerciales.

Las sesiones se limitan a `metadata.read`, duran como máximo quince minutos y guardan solamente una huella de la referencia de identidad. El laboratorio no expone una operación de escritura y el preflight externo continúa pendiente.
