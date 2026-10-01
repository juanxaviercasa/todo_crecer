# Fase 9: pipeline seguro de activos

## Recorrido

1. Validar identificadores y nombre seguro.
2. Aplicar el límite de bytes según logo, fotografía, documento o video.
3. Detectar PNG, JPEG, WebP, PDF o MP4 mediante firma binaria.
4. Comparar el tipo detectado con el declarado y con la clase esperada.
5. Medir las dimensiones disponibles y rechazar imágenes fuera de 1–12.000 px.
6. Buscar indicadores de contenido activo como barrera temprana.
7. Guardar en cuarentena con SHA-256.
8. Solicitar veredicto a un escáner externo.
9. Registrar aprobación o rechazo de derechos.
10. Exigir variantes responsivas para imágenes.
11. Habilitar `web_ready` únicamente al completar todas las compuertas.

## Estados

`quarantined`, `awaiting_rights`, `awaiting_variants`, `ready_private`, `web_ready`, `rejected` y `revoked`.

`ready_private` permite conservar de forma privada un documento o video aprobado. No concede publicación. `web_ready` solo aplica actualmente a logos y fotografías con variantes completas.

## Variantes

- Logo: 160 y 320 px.
- Fotografía: 480, 960 y 1600 px.

Cada variante debe declarar ancho, tipo, bytes, SHA-256 y clave del objeto. El pipeline no crea imágenes falsas ni copia el original como si fuera una optimización. La transformación real sigue pendiente.

## Revocación

`revoke()` exige motivo, fija el estado `revoked`, retira `publishable` y bloquea análisis o cambios posteriores. En producción, el adaptador deberá retirar objetos derivados, purgar cachés y ordenar la reconstrucción de cualquier sitio que los use.

## Límites

La detección de firma y marcadores no sustituye un decodificador endurecido ni un antivirus. JPEG progresivo y WebP VP8X pueden medirse; otros subconjuntos deberán pasar por el transformador real. El flujo no acepta cargas desde la consola y utiliza exclusivamente bytes sintéticos.
