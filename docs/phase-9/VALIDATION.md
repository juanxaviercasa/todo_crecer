# Validación de Fase 9

## Resultado

- 22 esquemas JSON Schema válidos.
- 13 ejemplos contractuales válidos.
- 26 casos contractuales negativos rechazados.
- 87 pruebas totales aprobadas.
- 0 pruebas fallidas.

## Cobertura nueva

- detección PNG por bytes y lectura de dimensiones;
- discrepancia entre tipo declarado y detectado rechazada;
- contenido activo rechazado antes del escáner;
- límite por clase de activo;
- cuarentena inicial sin publicación;
- fallo del escáner conservado y malware rechazado;
- veredicto limpio todavía sujeto a derechos;
- tres variantes obligatorias para fotografías;
- variantes bloqueadas antes de seguridad y derechos;
- rechazo de derechos;
- revocación inmediata e inmutable;
- consola HTTP local de solo lectura, `noindex` y aislada.

## Alcance

El escáner usado en pruebas es solo un veredicto contractual sintético. No analiza malware. No se transforman imágenes reales, no se eliminan metadatos y no se conecta almacenamiento remoto. Estos tres puntos bloquean cualquier uso productivo.
