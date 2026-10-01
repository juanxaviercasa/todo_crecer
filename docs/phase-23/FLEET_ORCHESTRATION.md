# Orquestación durable de flota

La Fase 23 implementa un plano local de ejecución para las decisiones de la Fase 22. El motor no despliega sitios: construye y opera una cola sintética con garantías de aislamiento y recuperación.

## Flujo

1. Registrar estado deseado y observado por sitio.
2. Crear un plan de reconciliación sin efectos externos.
3. Encolar una operación por diferencia más `verify_state`.
4. Suprimir duplicados mediante clave idempotente.
5. Reclamar el trabajo si ventana, concurrencia y presupuesto lo permiten.
6. Mantener el lease mediante heartbeat.
7. Completar, reintentar con backoff o enviar a dead-letter.
8. Volver a observar antes de considerar reconciliado el sitio.

Los workers sólo reciben digests y referencias. No se almacenan credenciales, contenidos privados ni payloads arbitrarios.
