# Fase 14 — Portal del propietario

## Capacidades ejecutables

- Sesión ligada a un negocio.
- Caducidad absoluta de ocho horas e inactividad de treinta minutos.
- Protección CSRF con comparación de tiempo constante.
- Revocación inmediata.
- Reautenticación AAL2.
- Acceso reciente obligatorio para revelar contactos.
- Preferencias con versión optimista y forma cerrada.
- Solicitudes de acceso, corrección, retiro y eliminación.
- Flujo de verificación de identidad antes de procesar privacidad.
- Solicitudes limitadas de cambio comercial.
- Revisión independiente antes de modificar la fuente de verdad.
- Auditoría encadenada y firmada, sin PII.

## Límite de datos

El portal administra referencias. Nombre, email, teléfono y mensaje permanecen cifrados. Solo `revealContact` puede recuperarlos, después de comprobar tenant, permiso, AAL2 y antigüedad de la reautenticación.

La interfaz incluida es una demostración estática. Los botones no inician sesión, no envían solicitudes y no abren registros reales.

## Pendientes de producción

- proveedor de identidad y MFA;
- cookies seguras, rotación y cierre global de sesión;
- persistencia compartida de sesiones;
- rate limiting de autenticación y revelado;
- gestión segura de claves de auditoría;
- proceso legal y operativo de solicitudes de privacidad;
- revisión humana de cambios y regeneración del sitio;
- alertas de acceso anómalo.
