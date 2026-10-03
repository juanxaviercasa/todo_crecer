# Fase 48 — SLO, observabilidad económica y respuesta simulada

La fase 48 extiende la observabilidad técnica existente con contexto financiero y respuesta verificable. Produce snapshots sin datos personales, calcula presupuesto de error y burn rate, detecta anomalías de coste, deduplica señales, abre un incidente crítico y ensaya su runbook y rollback.

## Escenarios

- **Baseline:** disponibilidad 99,98%, 20% del presupuesto de error consumido, burn normal y coste 3,33% sobre baseline. La decisión es `observe`.
- **Incidente correlacionado:** disponibilidad 99,60%, presupuesto agotado al 400%, burn 50×/8× y coste 108,33% sobre baseline. Siete ocurrencias quedan agrupadas en una sola alerta crítica.
- El rollback simulado recupera 99,95% de disponibilidad, normaliza el coste y queda en `human_close_review`.

## Seguridad

- Cero campos personales y cero notificaciones externas.
- Runbook y rollback solo en simulación.
- Remediación real bloqueada.
- Panel local, de solo lectura y `noindex`.

## Ejecución

```sh
npm test
npm run build
npm run start:economic-observability
```

Abrir `http://127.0.0.1:4222/`.
