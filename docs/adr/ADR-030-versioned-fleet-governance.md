# ADR-030 — Gobierno versionado de flota

## Estado

Aceptado para la implementación local sintética de la Fase 22.

## Contexto

Escalar miles de sitios con una receta mutable impediría saber qué comportamiento, diseño y artefactos utiliza cada sitio. También haría difícil detener una degradación o regresar a una versión conocida.

## Decisión

Las recetas, sistemas visuales y motores se fijan mediante versiones semánticas y digests. Una combinación debe pasar compatibilidad antes de asociarse con un sitio. Los cambios se distribuyen mediante cohortes ordenadas, checkpoints y umbrales de calidad. Una deriva crítica o un guardrail fallido habilita un rollback registrado. La creación, aprobación y ejecución sensible requieren actores diferentes.

Las propuestas de aprendizaje de la Fase 21 pueden originar una nueva receta, pero nunca la publican. La Fase 22 tampoco realiza despliegues: genera decisiones y expedientes locales que una capa de publicación autorizada podría consumir.

## Consecuencias

- Cada sitio puede explicar su versión actual y objetivo.
- La calidad se mide por sitio y por portafolio.
- Una expansión se detiene antes de alcanzar toda la flota.
- La deprecación conserva una sucesora, fecha, afectados y bloqueos.
- Se requiere almacenar históricos y digests, no sólo el último estado.
