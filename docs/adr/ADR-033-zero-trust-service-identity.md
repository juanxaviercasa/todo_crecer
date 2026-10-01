# ADR-033 — Identidad de servicios y control privilegiado

## Estado

Aceptado para la implementación local sintética de la Fase 25.

## Contexto

La persistencia durable permite ejecutar trabajo real, pero una red o proceso interno no debe considerarse confiable por ubicación. Los tokens largos, secretos compartidos y permisos globales convertirían un servicio comprometido en acceso transversal a la flota.

## Decisión

Cada workload tendrá una identidad distinta, vinculada a su runtime, tenants y capacidades. Las credenciales serán firmadas con Ed25519, tendrán audiencia explícita y expirarán en minutos. La autorización evaluará identidad, estado, firma, expiración, audience, tenant, capacidad, ambiente, riesgo y MFA cuando la política lo exija.

Las operaciones de alto riesgo requieren aprobación independiente. Las críticas requieren dos aprobadores y un ejecutor diferente. El acceso break-glass exige ticket, motivo, aprobador, alcance exacto y caducidad automática. Toda decisión se añade a una cadena hash firmada.

## Consecuencias

- Revocar una identidad invalida sus credenciales activas.
- Una credencial de un tenant no atraviesa a otro.
- La rotación conserva una ventana de gracia explícita y medible.
- Ninguna persona puede solicitar, aprobar y ejecutar una operación crítica.
- La auditoría detecta alteraciones, aunque esta implementación local todavía no usa almacenamiento WORM externo.
