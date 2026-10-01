# ADR-020 — Límite privado para interacciones

**Estado:** aceptado para implementación local  
**Fecha:** 2026-09-30

## Decisión

Todo formulario público termina en un adaptador que ejecuta validación cerrada, consentimiento, minimización y controles de abuso antes de crear datos privados. Una solicitud aceptada produce dos documentos separados y cifrados: `ConsentReceipt` e `InteractionSubmission`. Un rechazo no conserva nombre, correo, teléfono ni mensaje.

La IP no se guarda en texto claro. Se deriva una huella HMAC con un secreto rotatorio para limitar tráfico. El agente del navegador se resume con SHA-256. El consentimiento comercial es independiente y `false` por defecto.

## Retención

- Consulta general o interés en un inmueble: 90 días.
- Solicitud de tasación: 180 días.
- Cada registro nace con `delete_after`.
- Un retiro verificado debe borrar consentimiento y solicitud, detener marketing y conservar solo un comprobante no sensible.

## Consecuencias

El frontend no puede escribir directamente en la base ni en almacenamiento de objetos. Producción necesita un secreto HMAC, un desafío anti-bot, entrega transaccional, verificación de identidad para retiros y un trabajo programado de eliminación. Hasta conectar y comprobar esos proveedores, la recepción pública permanece bloqueada.
