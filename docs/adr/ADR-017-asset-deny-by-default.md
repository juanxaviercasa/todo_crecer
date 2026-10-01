# ADR-017: activos denegados por defecto

- Estado: aceptado para desarrollo
- Fecha: 2026-09-30

## Decisión

Todo archivo nuevo entra en cuarentena y carece de capacidad de publicación. La extensión y el tipo enviado por el navegador no se consideran evidencia. El sistema determina el tipo por firma binaria, aplica límites por clase, mide imágenes y busca marcadores activos antes de solicitar un veredicto antimalware externo.

Una fotografía o logo solo llega a `web_ready` cuando el veredicto es limpio, los derechos están aprobados y existen todas las variantes requeridas. La revocación elimina inmediatamente `publishable` y bloquea mutaciones posteriores.

## Consecuencias

- Fallos del escáner conservan la cuarentena.
- Un veredicto limpio no sustituye la revisión de derechos.
- Las variantes no se aceptan antes de las otras compuertas.
- La detección local de marcadores es una primera barrera, no un antivirus.
- La producción necesita un transformador que decodifique y recodifique las imágenes, elimine metadatos y emita comprobantes verificables.
