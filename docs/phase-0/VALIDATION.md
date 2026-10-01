# Resultado de validación

Ejecución: 2026-09-29. Resultado: **PASS**.

| Comprobación | Resultado |
|---|---|
| Esquemas Draft 2020-12, metaschema y referencias locales | 13 válidos |
| Ejemplos JSON: 7 documentos y 6 eventos | 13 válidos |
| Casos negativos que deben rechazarse | 26 rechazados correctamente |
| Integridad entre documentos y manifiesto HTML | PASS |
| Formatos de fecha, URI, UUID y JSON Pointer | Habilitados |
| Resolución remota de esquemas | Deshabilitada; registro local |

Validador: Ajv 8.17.1 y ajv-formats 3.0.1, dependencias fijadas en package-lock.json.
Reproducir desde la raíz del proyecto: `npm ci --ignore-scripts` y `npm test`.
En Windows puede usarse `npm.cmd`.

Los casos negativos cubren demos indexables o sin banner, campos desconocidos,
colores y fechas inválidos, sugerencias publicables, falta de evidencia, rutas con
traversal, publicación sin QA, combinaciones inválidas de estado/error/output,
outputs anidados inválidos, tipos/UUID/eventos incompatibles, fuentes o rutas
ausentes, discrepancias de negocio, hashes alterados, causalidad inexistente o
cíclica, subject incorrecto y tiempos de agente invertidos.

Este informe acredita únicamente contratos y coherencia del fixture sintético.
No acredita un agente IA ejecutado, auditoría de navegador, accesibilidad, seguridad
del futuro motor, autorización sobre datos reales, entrega de mensajes o deployment.
SiteSnapshot mantiene QA not_run y publicación not_published de forma intencional.
