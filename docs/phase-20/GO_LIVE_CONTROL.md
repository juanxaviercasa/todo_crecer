# Fase 20 — control de go-live e hypercare

## Objetivo

Evitar que “publicar” sea un botón aislado. La fase convierte el lanzamiento en una secuencia auditable con una línea base, decisiones explícitas, métricas y recuperación.

## Flujo

1. Crear un plan ligado al paquete aceptado de la Fase 19.
2. Definir hostname, ventana, SLO, responsable de incidente y objetivo de rollback.
3. Activar el change freeze sobre el digest exacto.
4. Registrar GO de negocio, técnica, operaciones y privacidad.
5. Iniciar un run local `dry_run`.
6. Observar 5%, 25%, 50% y 100% en orden.
7. Entrar a hypercare si todas las etapas cumplen el SLO.
8. Verificar lanzamiento, 24h y 72h.
9. Cerrar el run y liberar el freeze, o registrar rollback.

## Invariantes

- El paquete aceptado no puede sustituirse mediante una actualización.
- Un plan congelado no admite cambios ordinarios.
- El creador no aprueba las áreas técnicas.
- Negocio requiere una decisión del propietario del tenant.
- Cada área decide una sola vez por digest.
- Las etapas canary y los checkpoints de hypercare son secuenciales.
- Un SLO fallido detiene el run.
- `apply`, mensajes y publicación externa no existen en el adaptador local.

## Escenarios incluidos

“Horizonte” completa cuatro etapas y tres checkpoints. “Ladera” pasa el 5%, incumple disponibilidad y latencia en el 25%, y genera un rollback simulado al release estable.
