# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 42

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 42 implementa el gate de evidencia y decisión reversible: entregas sanitizadas, revisiones legales y de compras independientes, sesiones de lectura verificables, dossier humano y plan dry-run de reversión. No realiza cambios externos.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:evidence-gate
```

Abrir http://127.0.0.1:4216/.

## Estado comprobado

- 337 contratos JSON Schema.
- 1.376 pruebas aprobadas y 0 fallidas.
- 13 pruebas específicas de la fase 42.
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

## Fase 43 recomendada

**Primera incorporación real bajo control.** Cuando exista un candidato autorizado, importar su manifiesto sanitizado, cerrar legal y compras, verificar la sesión real read-only y registrar una única decisión reversible. Mantener bloqueado cualquier apply o publicación hasta una aprobación explícita posterior.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
