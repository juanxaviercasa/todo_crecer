# Workflow de chats especializados

## Estado de Fase 1

Usar esta versión completa del proyecto (0.3.0) como base. Leer primero
`docs/phase-1/LOCAL_ENGINE.md` y `docs/phase-1/VALIDATION.md`. Ejecutar `npm test`,
`npm run build` y `npm run qa:browser` para cambios de motor o contenido.
No editar manualmente los archivos generados en dist para implementar un cambio:
modificar inputs o componentes, generar otro build y mantener la evidencia de QA.
Los datos reales, hosting, claim y pagos aún no están habilitados.

## Handoff de contratos de Phase 0

Entregar siempre la carpeta o ZIP completo de esta versión, incluyendo
`package-lock.json`, `scripts/validate.cjs`, `docs/phase-0/CONTRACTS.md` y
`examples/golden-business/`. Ejecutar `npm ci --ignore-scripts` y `npm test`
antes y después de modificar contratos. No reconstruir esquemas a partir del chat.

Al cambiar datos de un fixture, actualizar sus referencias y hashes de todos los
consumidores, incluido el documento embebido en AgentOutput y en eventos.
Las tres definiciones originales siguen intactas; cambios incompatibles requieren
nueva versión y una decisión documentada. Nunca presentar el fixture sintético
como negocio real aprobado ni dar por cerrado el gate de procedencia de datos.

## Chat maestro

Mantener la conversación original para:
- decisiones de arquitectura;
- cambios al Master Blueprint;
- resolución de conflictos entre módulos;
- revisión de hitos y go/no-go.

## Chats especializados

Crear un chat por módulo cuando comience su implementación. Cada chat debe recibir:
1. el Master Blueprint;
2. los contratos relevantes;
3. los ADR relacionados;
4. el objetivo exacto de la fase;
5. los archivos actuales que debe modificar.

Chats recomendados, en este orden:

1. `01-business-truth-data-provenance`
2. `02-site-engine-vertical-recipes`
3. `03-brand-intelligence-content`
4. `04-qa-browser-audit`
5. `05-cloudflare-demo-platform`
6. `06-claim-billing-entitlements`
7. `07-customer-portal`
8. `08-automation-events-queues`
9. `09-ai-model-router-agents`
10. `10-analytics-growth`

## Regla de sincronización

Al terminar una sesión especializada:
- guardar los archivos generados en el monorepo;
- registrar decisiones nuevas en un ADR;
- actualizar tests/schemas;
- volver al chat maestro solo si la decisión afecta a otros módulos.
