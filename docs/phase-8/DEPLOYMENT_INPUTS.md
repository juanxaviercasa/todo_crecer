# Entradas necesarias para conectar el entorno

No hace falta proporcionar estas entradas durante el desarrollo local. Se solicitarán juntas cuando se autorice la preparación del entorno remoto.

## Cloudflare

- `CF_D1_DATABASE_ID`: identificador de la base creada para metadatos.
- `CF_R2_BUCKET_NAME`: bucket privado de activos y sobres cifrados.
- `CF_QUEUE_NAME`: cola principal de trabajos.
- `CF_DEAD_LETTER_QUEUE_NAME`: cola de mensajes agotados.
- `CF_ACCESS_AUD`: audience tag de la aplicación Access.
- `CF_ACCESS_TEAM_DOMAIN`: dominio del equipo Access.

## Secretos generados fuera del repositorio

- `VAULT_KEY`: 32 bytes aleatorios codificados en base64.
- `AUDIT_KEY`: al menos 32 bytes aleatorios codificados en base64.
- `SESSION_SIGNING_KEY`: secreto independiente para sesiones.

Las claves deben generarse en un entorno controlado, cargarse con el mecanismo de secretos y tener identificador de versión. No se deben pegar en JSON, documentación, commits ni capturas.

## Análisis de archivos

- `MALWARE_SCANNER_ENDPOINT`.
- `MALWARE_SCANNER_TOKEN`.

Antes de elegir proveedor se debe confirmar residencia de datos, tamaños máximos, retención, eliminación, tratamiento de fotografías y coste por archivo. Mientras falte cualquiera de estas condiciones, todos los activos permanecen en cuarentena.

## Compuertas posteriores

Tener estas entradas solo permite iniciar la integración. Todavía será obligatorio probar autenticación, aislamiento, rotación, concurrencia de auditoría, reintentos, backups, restauración, alertas y rollback antes de admitir datos de un negocio real.
