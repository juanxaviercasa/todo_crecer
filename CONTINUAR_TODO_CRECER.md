# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 43

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 43 implementa la ceremonia de incorporación para un único proveedor: manifiesto sanitizado, cuarentena, cierres legal y de compras, verificación read-only, autorización reversible, ventana sin apply y rollback ensayado. No realiza cambios externos.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:provider-onboarding
```

Abrir http://127.0.0.1:4217/.

## Estado comprobado

- 364 contratos JSON Schema.
- 1.376 pruebas aprobadas y 0 fallidas.
- 17 pruebas específicas de la fase 43.
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

## Fase 44 recomendada

**Activación canary del proveedor con doble control.** Preparar un canary de metadatos sin datos de clientes, validación de integridad, SLO, presupuesto, rollback automático y aprobación humana separada. Mantener la aplicación real bloqueada hasta que exista el expediente real completo de fase 43.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
