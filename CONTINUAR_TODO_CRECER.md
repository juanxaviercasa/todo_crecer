# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 44

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 44 implementa un canary sintético de proveedor con etapas 5/25/50/100, baseline de integridad, SLO, presupuesto, doble aprobación y rollback automático. No realiza cambios externos.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:provider-canary
```

Abrir http://127.0.0.1:4218/.

## Estado comprobado

- 373 contratos JSON Schema.
- 1.376 pruebas aprobadas y 0 fallidas.
- 19 pruebas específicas de la fase 44.
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

## Fase 45 recomendada

**Control de producción y cierre de hipercuidado.** Preparar freeze, autorización final de corta duración, telemetría de producción sin PII, checkpoints de hipercuidado, revocación inmediata y cierre verificable. Ensayar todo localmente y mantener apply bloqueado hasta disponer del expediente real de fase 43.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
