# ADR-016: puertos de infraestructura y perfil Cloudflare

- Estado: aceptado para desarrollo
- Fecha: 2026-09-30

## Contexto

El núcleo privado de Fase 7 funciona con archivos locales, claves inyectadas y una auditoría local. Conectar directamente el dominio a APIs de un proveedor dificultaría las pruebas, la migración y el aislamiento de responsabilidades.

## Decisión

El dominio consumirá puertos estables para identidad, metadatos, claves, objetos, colas y análisis. Fase 8 implementa un adaptador local y describe un perfil Cloudflare sin ejecutar despliegues.

La asignación prevista es Access para el perímetro administrativo, D1 para metadatos y membresías, R2 privado para cuerpos cifrados y activos, Workers Secrets para material sensible, y Queues para trabajos asíncronos. El análisis antimalware permanece detrás de un adaptador externo porque todavía no se ha seleccionado proveedor.

La cadena de auditoría necesita un único escritor lógico en producción. D1 almacenará las entradas, pero la secuenciación deberá pasar por un coordinador serializado antes de conectar datos reales. No se considera resuelta solo por crear la tabla.

## Consecuencias

- El modo local puede probarse sin cuentas externas.
- Los nombres de binding quedan estables para una implementación Worker posterior.
- Ningún placeholder se interpreta como credencial válida.
- La disponibilidad de configuración no equivale a autorización para publicar.
- El despliegue queda bloqueado hasta implementar identidad de aplicación, escritor único de auditoría, escáner, observabilidad y rollback.
