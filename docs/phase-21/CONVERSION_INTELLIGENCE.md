# Fase 21 — inteligencia de conversión

## Objetivo

Demostrar si cada experiencia ayuda al negocio sin convertir la medición en seguimiento personal.

## Capacidades

- Embudos deduplicados por bucket efímero.
- Web Vitals agregados mediante percentil 75.
- Calidad de leads como conteos agregados.
- Experimentos control/treatment con aprobación independiente.
- Resultados `insufficient_data`, `equivalent`, ganadores o `guardrail_failed`.
- Propuestas de aprendizaje con evidencia y `auto_publish: false`.

## Límites

La implementación local usa fixtures. No contiene SDK web, cookies, pixels, endpoints públicos ni datos reales. Antes de conectar medición real se debe definir consentimiento, retención y proveedor.
