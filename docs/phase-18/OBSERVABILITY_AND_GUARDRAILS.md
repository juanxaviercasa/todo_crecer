# Fase 18 — Observabilidad y guardrails

## Flujo

1. Los servicios emiten eventos con estructura cerrada.
2. El evaluador agrupa por tenant, servicio y ventana.
3. El SLO calcula disponibilidad, p95 y consumo del error budget.
4. El uso se compara con límites técnicos del tenant.
5. Las condiciones de riesgo generan alertas deduplicadas.
6. Una alerta crítica puede abrir un incidente correlacionado con releases.
7. El snapshot de salud agrega SLO, alertas e incidentes.

## Minimización

No se aceptan nombres, correos, teléfonos, direcciones, mensajes, cuerpos HTTP, consultas, user agents, IP ni etiquetas arbitrarias. El esquema rechaza campos adicionales y los tests comprueban ese límite.

## Guardrails

Cada recurso define umbral de advertencia, límite duro y acción:

- `observe`: informa, sin bloquear;
- `throttle`: permite con limitación;
- `block_new`: impide crear consumo adicional;
- un recurso desconocido se deniega.

Los valores son unidades técnicas de staging. No representan planes, precios ni compromisos comerciales.

## Estado externo

El adaptador local simula una entrega con `external_messages: 0`. Email, WhatsApp, Slack y webhooks no están configurados. Tampoco existe un backend remoto de métricas.
