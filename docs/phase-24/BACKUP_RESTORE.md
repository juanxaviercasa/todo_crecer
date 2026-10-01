# Backup, RPO y restore

El backup usa la API nativa de SQLite y se valida mediante:

- SHA-256 del archivo;
- `PRAGMA integrity_check`;
- conteo de entidades, eventos y transacciones;
- high-water transaction.

El plan de restore fija backup, objetivo y destino. El creador no puede aprobarlo y ninguno de esos dos actores puede ejecutarlo. El simulacro abre la base restaurada y verifica integridad, digests, eventos entregados y pendientes recuperables.

RPO mide la distancia temporal entre el backup y la última transacción de la fuente. RTO mide el tiempo del simulacro local. También se compara el número de transacciones posteriores al backup con el máximo aceptado.
