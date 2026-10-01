# Persistencia del control plane

La Fase 24 introduce un repositorio SQLite local para entidades de control: estado deseado y observado, trabajos, leases, presupuestos, idempotencia, dead-letter y sitios de flota.

Cada registro conserva tenant, tipo, identificador, versión, digest, transacción y fechas. El payload se serializa canónicamente antes de calcular su SHA-256.

La base activa WAL, claves foráneas y un tiempo de espera acotado. El motor permanece local y no implementa replicación, alta disponibilidad o conexiones remotas.
