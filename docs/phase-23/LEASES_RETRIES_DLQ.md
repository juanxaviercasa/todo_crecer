# Leases, reintentos y dead-letter

Un lease identifica trabajo, tenant, worker, adquisición, heartbeat y expiración. Sólo el worker propietario puede renovarlo o cerrarlo. La expiración devuelve el trabajo al ciclo de reintento.

El backoff base es 30 segundos y se duplica en cada intento hasta un máximo de una hora. Al agotar intentos, el trabajo pasa a dead-letter con un código cerrado y un resumen seguro sin datos privados.

El replay requiere un operador autorizado. No reabre la misma clave idempotente; crea un trabajo nuevo vinculado al fallo anterior.
