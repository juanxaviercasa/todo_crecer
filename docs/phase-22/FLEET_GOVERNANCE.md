# Gobierno de flota

La Fase 22 convierte las recetas y sistemas visuales en activos versionados que pueden administrarse en una flota grande sin perder trazabilidad. Cada sitio declara una receta, un sistema visual, una versión del motor y un digest de release.

## Flujo

1. Registrar una receta o un sistema visual como borrador.
2. Obtener aprobación independiente para activarlo.
3. Evaluar compatibilidad entre receta, diseño y motor.
4. Registrar sitios con versiones exactas.
5. Calcular calidad y hard gates por sitio.
6. Crear y aprobar una cohorte con pasos crecientes hasta 100%.
7. Evaluar cada checkpoint.
8. Avanzar, pausar o revertir según calidad, incidentes y deriva.
9. Gestionar la deprecación sin eliminar versiones utilizadas.

## Límites

El adaptador es local y en memoria. Los doce sitios son sintéticos. No llama a Cloudflare, GitHub, DNS, analítica ni sistemas del negocio. `external_changes` permanece en `false` y no existe avance automático entre checkpoints.
