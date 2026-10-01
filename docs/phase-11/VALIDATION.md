# Validación de Fase 11

## Resultado

- 25 esquemas JSON Schema válidos.
- 102 pruebas totales aprobadas.
- 0 pruebas fallidas.

## Cobertura nueva

- hashes, bytes y dimensiones derivados de tres archivos reales del fixture;
- fixtures admitidos únicamente en demo local;
- identificador, nombre y bytes del catálogo contrastados con el registro;
- 35 usos indexados en cinco sitios;
- impacto exacto de revocación;
- activo revocado bloqueado antes de escribir un perfil;
- registro, índice y página de trazabilidad incluidos en el build;
- servidor de trazabilidad de solo lectura, `noindex` y sin conexiones externas;
- PDF con acciones activas rechazado;
- metadatos C2PA legítimos diferenciados de contenido ejecutable.

## Alcance

La validación cubre fixtures locales y el cálculo de impacto. No transforma imágenes, analiza malware real, purga cachés ni reconstruye un despliegue remoto.
