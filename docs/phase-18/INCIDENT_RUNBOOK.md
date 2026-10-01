# Runbook de incidentes

## Detectar

Confirmar tenant, servicio, release, ventana y medición que abrió la alerta. Validar que no se trate de muestra insuficiente.

## Acotar

Comparar releases, rutas, estado de dominio, cola, almacenamiento y drift. Evitar incluir contactos o contenido de clientes en notas.

## Mitigar

Aplicar el mecanismo menos amplio: suspender una ruta, limitar consumo, pausar nuevos uploads o solicitar rollback al último release aprobado.

## Verificar

Exigir health checks correctos y una ventana suficiente de métricas recuperadas. Una respuesta aislada no demuestra recuperación.

## Resolver

El cierre requiere una persona autorizada, razón concreta y timeline completo. Resolver el incidente no borra las alertas ni el historial del release.

## Escalamiento externo

Permanece desconectado. Cuando se elija un proveedor se deberán definir destinos, horarios, severidades, deduplicación, reintentos y datos permitidos antes de enviar el primer mensaje.
