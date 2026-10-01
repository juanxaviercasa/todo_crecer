# Política de rollback

## Disparadores

- Disponibilidad menor al mínimo del SLO.
- Latencia p95 superior al máximo.
- Tasa de errores incompatible con la disponibilidad objetivo.
- Incidente abierto durante hypercare.
- Decisión manual documentada del operador.

## Registro

El trigger conserva origen, etapa, razones, objetivo estable, solicitante y hora. Nunca reescribe observaciones previas.

## Simulación local

El resultado `rolled_back` significa que el flujo tomó la decisión y verificó el contrato. `external_changes` permanece en cero; no se ejecuta tráfico, DNS, Worker ni caché reales.
