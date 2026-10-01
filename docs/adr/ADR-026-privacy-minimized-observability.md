# ADR-026 — Observabilidad minimizada y guardrails por tenant

## Estado

Aceptada para la Fase 18.

## Contexto

Publicar y operar múltiples sitios exige detectar degradación y consumo excesivo. Copiar formularios, mensajes o contactos a la telemetría aumentaría el riesgo sin aportar valor operativo.

## Decisión

La telemetría usa un contrato cerrado: tenant, servicio, release, resultado, conteo, duración, bytes y fecha. No admite etiquetas libres. Los SLO se calculan por tenant y servicio. Las alertas se deduplican por tenant, servicio, clase y release. Los límites son unidades técnicas, sin precios ni moneda.

Un incidente crítico conserva alertas, releases, responsable y línea temporal. La notificación externa es un puerto independiente; el adaptador predeterminado falla cerrado.

## Consecuencias

- La operación puede relacionar una degradación con el release exacto.
- Los límites desconocidos se deniegan y los topes tienen una acción explícita.
- `insufficient_data` no se interpreta como saludable.
- La retención y el almacenamiento distribuido siguen pendientes de infraestructura autorizada.
