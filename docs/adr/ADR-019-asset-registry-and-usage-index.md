# ADR-019: registro de activos e índice inverso de usos

- Estado: aceptado
- Fecha: 2026-09-30

## Decisión

El renderer no recibirá rutas de imágenes sin contexto. Cada referencia del catálogo debe resolver a un activo registrado cuyo identificador, nombre, bytes y SHA-256 coincidan con el archivo disponible.

El build genera un índice inverso `activo → páginas`. Una revocación cambia toda elegibilidad a `false` y devuelve la lista de páginas que deben reconstruirse sin ese activo.

Los fixtures sintéticos tienen una excepción explícita y limitada a `local_demo`. Producción exige estado `web_ready`; cambiar el nombre o copiar un archivo no puede elevar su elegibilidad.

## Consecuencias

- Un archivo desconocido, modificado o revocado detiene el render.
- La retirada deja de depender de buscar rutas manualmente.
- El mismo activo puede aparecer en hero, tarjeta y detalle sin perder trazabilidad.
- El índice debe persistirse junto al build y verificarse antes de purgar o regenerar.
- La siguiente integración debe convertir registros aprobados de Fase 9 en entradas `web_ready` con variantes reales.
