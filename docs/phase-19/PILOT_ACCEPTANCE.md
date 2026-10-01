# Fase 19 — preparación y aceptación del piloto

## Objetivo

Convertir la incorporación del primer negocio colaborador en un proceso trazable. La fase reúne los contratos y gates necesarios para saber qué está listo, qué falta, quién lo revisó y qué versión aceptó el propietario.

## Flujo ejecutable

1. Un operador crea un expediente ligado a tenant, negocio y sitio.
2. Nueve requisitos reciben evidencia o un código de bloqueo.
3. El expediente completo entra a revisión con un hash inmutable.
4. Un actor distinto revisa contenido, visual, privacidad y técnica.
5. El propietario acepta siete alcances sobre el mismo hash.
6. El motor calcula readiness y enumera todos los bloqueos.
7. Un ensayo local recorre siete controles sin efectos externos.
8. El sistema sella un paquete local con `may_publish: false`.

## Requisitos del expediente

| Requisito | Evidencia esperada en un piloto real |
|---|---|
| Identidad | Autoridad del representante y vínculo con el negocio |
| Marca | Nombre, identidad y posicionamiento autorizados |
| Activos | Registro limpio, derechos y usos aprobados |
| Copy | Hechos confirmados, oferta y límites de afirmaciones |
| Diseño | Páginas y breakpoints revisados |
| Privacidad | Aviso y finalidades revisadas |
| Contacto | Canal público autorizado |
| Dominio | Propiedad o permiso de hostname |
| Publicación | Ruta, rollback y responsable de incidente |

## Propiedades de seguridad

- Aislamiento por tenant.
- Concurrencia optimista mediante `revision`.
- Revisiones y aceptación ligadas a `snapshot_hash`.
- Separación entre creador y revisor.
- Decisiones inmutables por área y revisión.
- Denegación de datos reales en el adaptador local.
- Cadena de auditoría verificable.
- Cero capacidad de publicar en el paquete final.

## Implementación

- Contratos: siete schemas `pilot-*`, `owner-pilot-*`, `launch-*`.
- Motor: `packages/pilot-acceptance/index.cjs`.
- Consola: `pilot-acceptance/app/`.
- Build sintético: `scripts/build-pilot-acceptance.cjs`.
- Persistencia prevista: `infra/cloudflare/migrations/0009_pilot_acceptance.sql`.

El fixture “Negocio Horizonte” demuestra el camino completo. “Negocio Ladera” conserva un bloqueo por derechos de activos y no puede entrar a revisión.
