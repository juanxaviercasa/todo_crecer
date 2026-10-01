# Fase 12 — Interacciones privadas

## Flujo ejecutable

`entrada → forma cerrada → consentimiento → honeypot → tiempo mínimo → límite → duplicado → contenido → cifrado → retención`

El módulo `packages/interaction-privacy/index.cjs` acepta únicamente 17 campos conocidos. Exige nombre, finalidad, aviso, autorización de contacto y al menos un canal válido. No devuelve datos de contacto en la respuesta pública.

## Documentos

- `ConsentReceipt`: finalidad, canales, versión del aviso, decisiones y huellas técnicas.
- `InteractionSubmission`: contacto mínimo, contexto, referencia al consentimiento y fecha de eliminación.
- `InteractionRejection`: motivo y huella pseudónima; nunca copia el contenido rechazado.

## Controles incorporados

1. Lista cerrada de campos.
2. Consentimiento explícito.
3. Marketing separado y desactivado por defecto.
4. Honeypot.
5. Tiempo mínimo de tres segundos.
6. Tres solicitudes por huella en quince minutos.
7. Duplicados bloqueados por 24 horas.
8. Límite básico de enlaces.
9. Cifrado AES-256-GCM mediante la bóveda de Fase 7.
10. Eliminación programable desde el momento de recepción.

## Integración productiva pendiente

La implementación local demuestra contratos y decisiones, pero no abre un endpoint público. Antes de activarlo deben configurarse secreto HMAC, CAPTCHA o desafío equivalente, correo transaccional, identidad del propietario, un cron de eliminación y observabilidad sin payloads privados.

No deben escribirse nombres, correos, teléfonos, mensajes ni tokens en logs.
