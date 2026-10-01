# Operación y recuperación

## Promoción

Antes de promover, comprobar que el build sigue aprobado, QA permanece en `passed`, el dominio está verificado, la ruta coincide con tenant/site/entorno y `site.publish` está permitido. Registrar una razón concreta. La promoción crea un release y mueve el puntero de la ruta.

## Rollback

Seleccionar un release histórico del mismo route. Confirmar que su build no fue revocado y que los gates actuales siguen vigentes. Crear el rollback con una razón; nunca cambiar el registro histórico. Purgar la caché después de mover la ruta.

## Revocación

Revocar un dominio marca binding y certificado como revocados y suspende las rutas asociadas. Revocar un build suspende cualquier ruta cuyo release activo lo utilice. La reactivación debe pasar nuevamente por verificación y promoción.

## Fallos del proveedor

No mover el puntero si el adaptador externo no confirma la operación necesaria. Conservar el release anterior activo, registrar el fallo y permitir reintento con la misma clave idempotente. Esta política deberá implementarse de forma transaccional al conectar Cloudflare.

## Señales mínimas

- promociones y rollbacks por tenant;
- tiempo desde aprobación hasta release;
- rutas suspendidas;
- errores de binding y certificado;
- purgas fallidas o pendientes;
- divergencia entre route y provider;
- integridad de la cadena de auditoría.
