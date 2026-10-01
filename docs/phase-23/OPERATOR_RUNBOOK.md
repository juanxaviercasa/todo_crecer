# Runbook del operador

## Cola sin movimiento

1. Revisar que exista una política de concurrencia.
2. Confirmar una ventana activa para la operación.
3. Verificar que el presupuesto esté abierto.
4. Revisar límites globales, por operación y por sitio.
5. Comprobar `available_at` cuando el trabajo está en retry.

## Lease expirado

1. Confirmar que el worker dejó de enviar heartbeat.
2. Ejecutar el sweep de leases expirados.
3. Verificar que el trabajo quedó programado para retry.
4. Investigar al worker antes de ampliar capacidad.

## Dead-letter

1. Leer código y resumen seguro.
2. Corregir la causa fuera de la cola.
3. Confirmar que el replay es apropiado.
4. Reproducir con una clave nueva.
5. Observar el estado del sitio antes de cerrar el incidente.

Nunca editar directamente intentos, digests, propietario del lease o estado observado.
