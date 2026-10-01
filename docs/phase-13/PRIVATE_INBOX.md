# Fase 13 — Bandeja privada multi-tenant

## Capacidades ejecutables

- Creación de casos desde una referencia `InteractionSubmission`.
- Aislamiento de propietarios por tenant.
- Asignación de responsable.
- Transiciones cerradas y motivo obligatorio al cerrar.
- Control optimista de concurrencia mediante `version`.
- SLA por finalidad: 15, 60 o 120 minutos.
- Una sola alerta de vencimiento por caso.
- Notas internas exclusivamente cifradas.
- Eventos operativos sin PII.
- Entregas idempotentes por evento y destino.
- Fallos de proveedor registrados sin afirmar entrega.

## Datos que sí están en la bandeja

ID del caso, tenant, sitio, referencia opaca a la solicitud, finalidad, prioridad, estado, responsable, SLA y versiones.

## Datos que no están en la bandeja

Nombre, email, teléfono, mensaje, texto de notas, IP, agente del navegador y contenido de consentimiento. Estos datos permanecen en la bóveda cifrada y requieren una lectura autorizada específica.

## Adaptadores pendientes

`local_outbox` demuestra el contrato. `email_adapter`, `whatsapp_adapter` y `crm_adapter` aparecen como puertos bloqueados. Antes de conectarlos se deben definir proveedor, cuenta, destino, política de reintentos, límites, secreto, tratamiento de errores y eliminación.
