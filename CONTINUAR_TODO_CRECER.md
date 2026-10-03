# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 41

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 41 implementa el preflight de salida en solo lectura: comparación de dos candidatos sintéticos, sesiones con alcance metadata_read, sondas sin escritura, residencia, cifrado, ciclo de vida, rotación, observabilidad y coste. No realiza cambios externos.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:preflight
```

Abrir http://127.0.0.1:4215/.

## Estado comprobado

- 337 contratos JSON Schema.
- 1.376 pruebas aprobadas y 0 fallidas.
- 15 pruebas específicas de la fase 41.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- 2 expedientes placeholder y 16 solicitudes obligatorias.
- 13 entregas sanitizadas con renovación programada.
- 8 revisiones de legal, seguridad, finanzas y compras.
- Un expediente con 100% de estructura y 0% de evidencia real.
- 2 riesgos críticos abiertos por candidato.
- Selección final bloqueada y 0 candidatos seleccionados.
- 0 secretos, 0 escrituras, 0 conexiones externas y 0 publicaciones.

## Gate real

La sala está operativa sin candidatos reales. Para habilitar una decisión humana se requieren 8/8 evidencias reales vigentes por candidato, cuatro revisiones aprobadas, cero riesgos críticos y autorización explícita de compras. La completitud placeholder nunca cuenta como evidencia real.

## Fase 42 recomendada

**Evidencia real y decisión humana controlada.** Cuando exista un proveedor candidato, importar únicamente evidencia suministrada por el operador, cerrar la revisión legal y de compras, repetir el preflight con una sesión real de solo lectura y registrar una decisión humana reversible. Mantener bloqueada la aplicación hasta disponer de un manifiesto real sanitizado y una autorización de salida.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
