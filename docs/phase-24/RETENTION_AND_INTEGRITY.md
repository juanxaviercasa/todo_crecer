# Retención e integridad

El escaneo combina integridad física y lógica. Recalcula el digest de cada payload de entidad y outbox. Cualquier diferencia marca el escaneo como fallido.

La política separa retención de eventos entregados, transacciones, snapshots y backups. La implementación ejecutable sólo elimina eventos entregados que superen su plazo. Los pendientes y reclamados siempre se preservan.

El borrado puede ensayarse en `dry_run`. La rotación real de snapshots y backups queda pendiente de un catálogo durable y almacenamiento externo autorizado.
