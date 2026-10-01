# ADR-032 — Persistencia transaccional y recuperación

## Estado

Aceptado para la implementación local sintética de la Fase 24.

## Contexto

La orquestación en memoria demuestra reglas, pero no sobrevive a un reinicio y no puede ofrecer atomicidad entre estado y eventos. Un backup que nunca se restaura tampoco prueba capacidad de recuperación.

## Decisión

Usar SQLite local con WAL para ensayar el modelo transaccional. Cada escritura exige una versión esperada y genera su evento de outbox dentro de la misma transacción. La integridad combina `PRAGMA integrity_check` con digests de payload.

Los backups se abren como bases independientes y se comparan con sus metadatos. Un restore requiere creador, aprobador y ejecutor diferentes, mide RPO/RTO y verifica que los eventos entregados no reaparezcan como pendientes.

## Consecuencias

- Un conflicto optimista no produce escrituras parciales.
- Un evento nunca se confirma sin su entidad.
- Los fallos lógicos pueden detectarse aunque SQLite siga siendo estructuralmente válido.
- El backup se considera válido sólo después de verificación y restore.
- Node.js 24 pasa a ser requisito de esta fase por `node:sqlite`.
