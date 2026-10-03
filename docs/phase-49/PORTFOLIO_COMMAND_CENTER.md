# Fase 49 — centro de mando del portafolio

La fase 49 agrega salud, coste, conversión, evidencia y riesgo para transformar el estado de múltiples negocios en una cola priorizada y explicable.

## Ensayo

- 8 negocios sintéticos y pseudonimizados.
- Distribución: 1 P0, 2 P1, 4 P2 y 1 P3.
- 8 trabajos asignados según especialidad y capacidad.
- 3 SLA internos vencidos y 3 escalamientos simulados.
- La existencia de un P0 produce `hold_critical` con ejecución bloqueada.

## Ejecución

```sh
npm test
npm run build
npm run start:portfolio-command
```

Abrir `http://127.0.0.1:4223/`.
