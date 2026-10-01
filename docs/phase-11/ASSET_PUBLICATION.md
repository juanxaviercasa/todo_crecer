# Fase 11: publicación trazable de activos

## Registro

`buildPilotRegistry()` lee `pilot/asset-sources.json`, abre cada archivo y deriva:

- tipo real por firma binaria;
- dimensiones;
- bytes;
- SHA-256;
- estado y elegibilidad;
- evidencia de derechos para el fixture.

Los valores derivados no se copian manualmente al archivo fuente, evitando registros obsoletos cuando cambian los bytes.

## Gate del renderer

Antes de crear una página, `assertCatalogAssets()` exige:

1. `asset_id` único en el catálogo;
2. existencia en el registro;
3. elegibilidad para el entorno;
4. coincidencia exacta de nombre;
5. coincidencia de tamaño y SHA-256 con el archivo.

Un fixture sintético solo pasa en `local_demo`. Un entorno productivo requiere `web_ready`.

## Índice inverso

`createUsageIndex()` registra los slots `hero`, `catalog_card` y `detail_hero`. Para los cinco perfiles actuales genera 35 usos: 15 para la imagen que también ocupa los heroes y 10 para cada una de las otras dos.

`revokeAsset()` devuelve páginas únicas y cantidad de usos. Para la imagen principal actual son 15 usos distribuidos en 10 páginas.

## Metadatos C2PA

Los PNG sintéticos contienen metadatos C2PA que incluyen recursos SVG internos. Buscar `<svg>` en todo archivo binario producía un falso positivo. El preflight se ajustó por tipo: una imagen raster válida puede conservar metadatos no ejecutables, mientras los PDF se revisan por acciones, JavaScript, lanzamientos y archivos embebidos. El escáner externo y la recodificación siguen siendo obligatorios para archivos reales.

## Límites

El registro actual no crea variantes ni eleva fixtures a producción. La revocación calcula impacto, pero todavía no ejecuta purga CDN ni despliegue. Esas acciones requieren los adaptadores remotos, autenticación administrativa y un procedimiento de rollback.
