# Activación controlada de staging

La fase añade la frontera que faltaba entre el ensayo local y una cuenta Cloudflare. El recorrido es:

1. Abrir una sesión read breve y verificar el token.
2. Probar permisos por familia de recursos.
3. Descubrir Workers, D1, R2, Queues, DNS y Secrets Store.
4. Normalizar IDs como fingerprints y configuración como digests.
5. Comparar inventario con el manifiesto deseado.
6. Producir un plan exacto e inmutable.
7. Obtener approvals de plataforma, seguridad y finanzas.
8. Emitir autorización apply de máximo quince minutos.
9. Ejecutar una sola vez con idempotencia y recibos redactados.
10. Verificar, hacer rollback si corresponde y revocar sesión.

La implementación prueba todo el recorrido con un transporte sintético. El transporte HTTP real existe, pero no se invocó porque no se entregaron credenciales.
