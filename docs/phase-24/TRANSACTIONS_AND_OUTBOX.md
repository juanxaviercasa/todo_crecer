# Transacciones, optimistic locking y outbox

Una escritura declara `expected_version`. Si la versión actual difiere, toda la transacción se rechaza. Si coincide, la versión aumenta y se inserta un evento en el outbox antes del commit.

El outbox admite `pending`, `claimed`, `delivered` y `dead_lettered`. Un claim tiene propietario y expiración. Los eventos entregados conservan su fila para impedir que una restauración los trate otra vez como pendientes.

La semántica práctica es entrega al menos una vez con consumidores idempotentes. La base no promete exactly-once fuera de su propia transacción.
