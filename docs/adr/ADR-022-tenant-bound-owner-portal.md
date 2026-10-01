# ADR-022 — Portal ligado a tenant y acceso reforzado

**Estado:** aceptado para implementación local  
**Fecha:** 2026-09-30

## Decisión

Cada sesión del portal queda ligada a un único `tenant_id`, incluso para operadores. El portal no almacena contraseñas: recibe una afirmación verificada de un proveedor de identidad. La sesión tiene caducidad absoluta, caducidad por inactividad, token CSRF resumido y estado revocable.

La visualización de un contacto requiere `aal2` y una reautenticación ocurrida durante los cinco minutos anteriores. La lista de casos no revela datos personales. Cada apertura queda registrada en una cadena de auditoría firmada que contiene la referencia del registro, nunca su contenido.

Las preferencias no almacenan emails o teléfonos de destino. Las solicitudes de cambios del negocio no modifican `BusinessTruth`; crean operaciones limitadas, ligadas al hash actual, que requieren revisión independiente.

## Consecuencias

Producción necesita un proveedor de identidad capaz de entregar tenant, rol y nivel de garantía verificables. La aplicación debe usar cookies seguras y `HttpOnly`; el token CSRF debe enviarse por un canal separado. Las respuestas que revelen contactos deben usar `no-store` y nunca entrar en telemetría, cachés o herramientas de analítica.
