# Puertos pendientes para archivos reales

## MalwareScanner

Entrada mínima: referencia privada del objeto, SHA-256, bytes, tipo detectado y tenant. Salida aceptada: `clean`, `malicious` o `failed`, acompañada de proveedor, versión del motor y fecha. Un timeout o respuesta ambigua se traduce a `failed` y conserva la cuarentena.

El proveedor debe permitir eliminación, limitar retención, documentar ubicación de procesamiento y evitar usar los archivos para entrenamiento. Las credenciales se inyectarán como secretos.

## ImageTransformer

Debe decodificar y recodificar el archivo, eliminar EXIF y otros metadatos no necesarios, corregir orientación, limitar píxeles, generar los anchos requeridos y devolver hashes y tamaños. Nunca debe considerar una copia byte a byte como variante procesada.

## AssetUsageIndex

Mantendrá la relación entre un activo y los builds que lo incorporan. La revocación consultará este índice para regenerar páginas, retirar variantes y purgar caché. Este puerto se implementará cuando el Site Engine consuma AssetProcessingRecord en lugar de rutas sintéticas directas.

## Datos que se pedirán

- Proveedor y endpoint del escáner.
- Token cargado mediante el gestor de secretos.
- Política aceptada de tratamiento y eliminación.
- Transformador elegido o autorización para usar un servicio gestionado.

No se necesitan todavía para ejecutar las 87 pruebas locales.
