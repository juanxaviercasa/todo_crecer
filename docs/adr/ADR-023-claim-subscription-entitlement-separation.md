# ADR-023 — Separar claim, estado comercial y entitlements

**Estado:** aceptado para implementación local  
**Fecha:** 2026-09-30

## Decisión

El acceso al producto se calcula con tres fuentes independientes:

1. `BusinessClaim`: prueba revisada de control del negocio.
2. `SubscriptionState`: estado normalizado de un proveedor comercial.
3. `EntitlementGrant`: excepción temporal, explícita y auditable.

Ninguna de estas fuentes es por sí sola una capacidad. `EntitlementSnapshot` deriva el resultado final y deniega cualquier clave desconocida.

El claim requiere dos clases de evidencia diferentes y una decisión de una persona distinta al solicitante. Solo se guardan metadatos y hashes; los documentos, llamadas o mensajes originales no entran en el claim.

Los perfiles técnicos permanecen en `draft` y no contienen precio, moneda, periodicidad ni términos. Solo `local_sandbox` puede utilizarlos. Un adaptador productivo debe rechazar un plan que no esté `active`.

## Acceso de seguridad

`portal.access`, `privacy.request` y `data.export.request` permanecen disponibles aunque no haya suscripción. Una suspensión comercial no puede impedir que la persona gestione su cuenta o ejerza solicitudes de privacidad.
