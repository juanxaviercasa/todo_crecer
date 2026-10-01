# ADR-021 — Bandeja privada y puertos de entrega

**Estado:** aceptado para implementación local  
**Fecha:** 2026-09-30

## Decisión

La operación comercial se representa con un `LeadCase` que solo contiene referencias opacas, finalidad, prioridad, estado, asignación y SLA. No se copian nombre, email, teléfono ni mensaje desde `InteractionSubmission`.

Las notas internas se cifran como registros privados. Los eventos nunca incluyen el cuerpo de una nota ni la referencia a la solicitud original. Las notificaciones externas transportan únicamente metadatos operativos y una ruta hacia la bandeja autenticada.

Cada mutación exige la versión esperada del caso. Cada entrega se identifica por el hash de `evento + destino`, de forma que un reintento lógico devuelve el intento existente.

## Flujo

`new → assigned → contacted → qualified → closed`

También se permite cerrar desde `new`, `assigned` o `contacted` con un motivo explícito. Los casos cerrados no generan alertas de SLA.

## Consecuencias

Correo, WhatsApp y CRM permanecen detrás de puertos. Ningún proveedor puede recibir datos de contacto desde los eventos de la bandeja. La apertura de la solicitud privada requiere identidad y autorización por tenant.
