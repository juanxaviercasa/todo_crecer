# Runbook del primer staging

## Antes de la ventana

- Elegir una cuenta Cloudflare de staging separada de producción.
- Confirmar account ID, zone ID y hostname exclusivo.
- Corregir DNS/TLS de `guialima.online` o elegir otro hostname de staging.
- Crear un token read temporal y ejecutar discovery.
- Revisar inventario huérfano, coste y plan exacto.
- Aprobar el digest en plataforma, seguridad y finanzas.
- Crear un token apply diferente, temporal y de alcance mínimo.

## Durante la ventana

- Volver a comprobar el digest y la caducidad de autorización.
- Aplicar una sola vez.
- Guardar únicamente receipts redactados.
- Ejecutar los doce checks en orden.
- Ante un fallo, detener y ejecutar el rollback aprobado.

## Cierre

- Revocar los tokens read y apply.
- Registrar fingerprints y confirmación de revocación.
- Sellar el expediente.
- Conservar el dossier sin valores secretos ni IDs del proveedor.
