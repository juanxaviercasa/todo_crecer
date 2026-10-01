# ADR-028: freeze y SLO como gates del go-live

## Estado

Aceptado para la Fase 20.

## Decisión

El go-live parte de un paquete aceptado e inmutable. Antes de operar se congela el plan y cuatro áreas registran una decisión sobre el mismo digest: negocio, técnica, operaciones y privacidad.

La progresión canary es fija: 5%, 25%, 50% y 100%. Cada etapa compara disponibilidad, latencia p95 y errores contra el SLO configurado. Una etapa fallida genera un trigger de rollback y cierra el run como `rolled_back`.

Un canary completo entra a hypercare. El freeze solo se libera después de los controles de lanzamiento, 24 horas y 72 horas, todos sin incidentes ni brechas.

## Alcance

La implementación de esta fase es un simulador local. No contiene un adaptador `apply` y todos los runs conservan cero efectos externos.
