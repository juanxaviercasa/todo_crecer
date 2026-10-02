# Fase 32 · Piloto asistido con un único negocio

La plataforma prepara una conversación humana completa para un solo candidato: Silvana Verano. El paquete incluye guion, FAQ, consentimiento, entrevista, activos, ensayo y gate. El contacto real continúa bloqueado hasta verificar el destino y autorizar el texto exacto.

- Tablero: `npm run build && npm run start:assisted-pilot` → http://127.0.0.1:4206/
- Documento: [docs/phase-32/ASSISTED_SINGLE_BUSINESS_PILOT.md](docs/phase-32/ASSISTED_SINGLE_BUSINESS_PILOT.md)
- Guía: [docs/phase-32/OPERATOR_PLAYBOOK.md](docs/phase-32/OPERATOR_PLAYBOOK.md)
- Decisión: [ADR-040](docs/adr/ADR-040-human-assisted-single-business-pilot.md)

---

# Fase 31 · Owner Simulation Lab

Esta fase prueba el recorrido del propietario con cinco gemelos sintéticos. Cubre aceptación, silencio, preguntas, activos incompletos y rechazo sin contactar a ningún negocio real.

- Laboratorio: `npm run build && npm run start:simulation` → http://127.0.0.1:4205/
- Documento: [docs/phase-31/OWNER_SIMULATION_LAB.md](docs/phase-31/OWNER_SIMULATION_LAB.md)
- Decisión: [ADR-039](docs/adr/ADR-039-synthetic-owner-simulation.md)

---

# Fase 30 · Owner Activation & Intake Desk

La plataforma ya prepara la incorporación verificable de los cinco candidatos del piloto. Incluye borradores revisados, consentimiento de un solo uso, entrevista, verdad comercial, derechos por activo, comparación antes/después y aceptación final. No se cargó ningún contacto real ni se envió ningún mensaje.

- Tablero: `npm run build && npm run start:intake-desk` → http://127.0.0.1:4204/
- Documento principal: [docs/phase-30/OWNER_INTAKE_DESK.md](docs/phase-30/OWNER_INTAKE_DESK.md)
- Decisión: [ADR-038](docs/adr/ADR-038-owner-activation-and-intake-desk.md)

---

# TodoLima / HazloCrecer Platform

## Fase 29 — cohorte inmobiliaria privada, versión 0.31.0

Esta entrega toma cinco candidatos públicos del dataset de TodoLima y los convierte en una cohorte privada con cinco arquetipos visuales: asesor independiente, agencia consolidada, consultoría premium, agencia distrital y especialista en proyectos. Cada candidato recibe expediente, checklist, invitación no enviada, sitio profesional diferenciado, QA visual, revisión de conversión y publication gate.

Requiere **Node.js 24 o superior**.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:cohort
```

Abrir **http://127.0.0.1:4203/**. La consola enlaza las cinco experiencias privadas. Todas llevan `noindex`, disclosure visible, placeholders identificados y contacto deshabilitado.

- Contratos: quince schemas de candidato, cohorte, consentimiento, derechos, diseño, revisión, aceptación y evidencia.
- Motor: `packages/private-cohort-pilot/index.cjs`.
- Snapshot sanitizado: `examples/phase-29/todolima-candidate-snapshot.json`.
- Generador: `scripts/build-private-cohort-pilot.cjs`.
- Interfaz: `cohort-private-pilot/app/`.
- Arquitectura: `docs/phase-29/PRIVATE_COHORT_PILOT.md`.
- Selección: `docs/phase-29/CANDIDATE_SELECTION.md`.
- Onboarding: `docs/phase-29/OWNER_INTAKE.md`.
- Diseño: `docs/phase-29/DESIGN_ARCHETYPES.md`.
- Validación: `docs/phase-29/VALIDATION.md`.

Las fuentes públicas no equivalen a autorización del propietario. Se omitieron teléfonos, direcciones exactas, coordenadas y URLs comerciales del snapshot. No se enviaron invitaciones, no se habilitó contacto y no se publicó ningún sitio.


## Fase 28 — primer lanzamiento de staging y expediente, versión 0.30.0

Esta entrega convierte la activación controlada en un recorrido auditable de lanzamiento: intención, discovery importado, conciliación, presupuesto, plan exacto, tres aprobaciones, autorización breve, apply de una sola vez, doce smoke checks, rollback, cierre de credenciales y expediente sellado.

Requiere **Node.js 24 o superior**.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:launch-evidence
```

Abrir **http://127.0.0.1:4202/**. La consola presenta un ensayo sintético completo con seis recursos observados, nueve deseados, tres aprobaciones, doce verificaciones y un expediente sellado. El lanzamiento real permanece bloqueado.

`npm run preflight:launch` revisa exclusivamente la presencia y forma de la configuración real. No imprime valores, no llama a Cloudflare y no aplica cambios.

- Contratos: quince schemas de intención, conciliación, coste, launch, smoke, rollback, cierre y expediente.
- Motor: `packages/staging-launch-evidence/index.cjs`.
- Interfaz: `staging-launch-evidence/app/`.
- Preflight: `scripts/run-staging-launch-preflight.cjs`.
- Workflow revisable: `.github/workflows/first-staging-launch.example.yml`.
- Arquitectura: `docs/phase-28/FIRST_STAGING_LAUNCH.md`.
- Runbook: `docs/phase-28/LAUNCH_RUNBOOK.md`.
- Smoke y rollback: `docs/phase-28/SMOKE_AND_ROLLBACK.md`.
- Expediente: `docs/phase-28/EVIDENCE_DOSSIER.md`.
- Validación: `docs/phase-28/VALIDATION.md`.

No se recibieron credenciales reales ni se ejecutó discovery privado o apply en Cloudflare. El ensayo usa referencias sintéticas, registra cero cambios externos y mantiene `guialima.online` como bloqueo hasta confirmar DNS y TLS.


## Fase 27 — activación controlada de staging, versión 0.29.0

Esta entrega separa discovery y apply de Cloudflare. Añade sesiones breves sin persistir tokens, pruebas de permisos, inventario normalizado con fingerprints, control de rate limits, plan exacto ligado a digest, tres aprobaciones, autorización con nonce de un solo uso, recibos redactados y un workflow CI con gate humano.

Requiere **Node.js 24 o superior**.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:activation
```

Abrir **http://127.0.0.1:4201/**. La consola muestra discovery sintético de seis recursos, nueve acciones planificadas, tres aprobaciones y una autorización activa. Apply no fue ejecutado.

El comando `npm run discover:cloudflare` queda preparado para discovery real de sólo lectura. Falla cerrado si no recibe `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_ZONE_ID` mediante el entorno.

- Contratos: quince schemas de sesión, permisos, discovery, plan, approvals, CI y readiness.
- Motor: `packages/cloudflare-staging-activation/index.cjs`.
- Interfaz: `staging-activation/app/`.
- CLI de lectura: `scripts/run-cloudflare-discovery.cjs`.
- Workflow revisable: `.github/workflows/staging-activation.example.yml`.
- Arquitectura: `docs/phase-27/STAGING_ACTIVATION.md`.
- Discovery: `docs/phase-27/READ_ONLY_DISCOVERY.md`.
- Apply gate: `docs/phase-27/APPLY_AUTHORIZATION.md`.
- Evidencia pública: `docs/phase-27/PUBLIC_PROBE_2026-09-30.md`.
- Validación: `docs/phase-27/VALIDATION.md`.

No se recibieron credenciales reales ni se consultó la cuenta Cloudflare. Las únicas consultas externas fueron DNS y HTTPS públicos. No hubo cambios de DNS, Workers, D1, R2, Queues o Secrets Store.

## Fase 26 — staging end-to-end, versión 0.28.0

Esta entrega integra el control plane completo detrás de adaptadores de staging. Añade entorno reproducible, topología de recursos, preflight sin persistir secretos, presupuesto con hard stop, plan inmutable, inventario, drift, promoción firmada, diez smoke tests, rollback y teardown ordenado.

Requiere **Node.js 24 o superior**.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:staging-control
```

Abrir **http://127.0.0.1:4200/**. La consola presenta nueve recursos sintéticos, nueve cambios simulados, inventario sin drift, presupuesto permitido, promoción firmada, diez verificaciones aprobadas, rollback ejecutado y teardown simulado.

- Contratos: dieciséis schemas de staging, recursos, planes, costes, drift, promoción y recuperación.
- Motor: `packages/staging-control-plane/index.cjs`.
- Interfaz: `staging-control-plane/app/`.
- Wrangler revisable: `infra/cloudflare/staging/wrangler.staging.example.jsonc`.
- Migración de referencia: `infra/cloudflare/migrations/0016_staging_control_plane.sql`.
- Arquitectura: `docs/phase-26/STAGING_CONTROL_PLANE.md`.
- Preflight y coste: `docs/phase-26/PREFLIGHT_AND_COST.md`.
- Promoción y rollback: `docs/phase-26/PROMOTION_SMOKE_ROLLBACK.md`.
- Teardown: `docs/phase-26/TEARDOWN_RUNBOOK.md`.
- Adaptación Cloudflare: `docs/phase-26/CLOUDFLARE_ADAPTER_GUIDE.md`.
- Validación: `docs/phase-26/VALIDATION.md`.

La configuración Cloudflare es una plantilla con placeholders y no se ejecuta automáticamente. El adaptador real continúa bloqueado; el escenario usa datos y referencias sintéticas.

## Fase 25 — identidad y control privilegiado, versión 0.27.0

Esta entrega añade una frontera zero trust local para servicios y operadores. Registra identidades de workload, emite credenciales Ed25519 breves, evalúa tenant, audiencia, capacidad y contexto, rota claves, firma artefactos y exige separación de funciones en operaciones críticas y acceso de emergencia.

Requiere **Node.js 24 o superior**.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:security
```

Abrir **http://127.0.0.1:4199/**. La consola presenta seis identidades sintéticas, credenciales de cinco minutos, 123 decisiones de acceso, una rotación de clave, una operación crítica con doble aprobación, un acceso break-glass y 153 evidencias encadenadas.

- Contratos: catorce schemas de identidad, autorización, claves, privilegios, emergencia y auditoría.
- Motor: `packages/zero-trust-security/index.cjs`.
- Interfaz: `zero-trust-security/app/`.
- Migración de referencia: `infra/cloudflare/migrations/0015_zero_trust_security.sql`.
- Arquitectura: `docs/phase-25/ZERO_TRUST_SECURITY.md`.
- Identidad y credenciales: `docs/phase-25/IDENTITY_AND_CREDENTIALS.md`.
- Operaciones privilegiadas: `docs/phase-25/PRIVILEGED_OPERATIONS.md`.
- Acceso de emergencia: `docs/phase-25/BREAK_GLASS_RUNBOOK.md`.
- Auditoría y firmas: `docs/phase-25/AUDIT_AND_ATTESTATION.md`.
- Validación: `docs/phase-25/VALIDATION.md`.

Las claves, identidades, tenants y operaciones son sintéticos y viven únicamente en el ensayo local. No existe conexión con un proveedor de identidad, un gestor de secretos ni producción.

## Fase 24 — persistencia y recuperación, versión 0.26.0

Esta entrega reemplaza el estado efímero por un control plane SQLite local con transacciones, optimistic locking y transactional outbox. Añade escaneo de integridad, snapshots, backups verificables, RPO/RTO, restore con separación de funciones y retención segura.

Requiere **Node.js 24 o superior** por el módulo nativo `node:sqlite`.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:recovery
```

Abrir **http://127.0.0.1:4198/**. La consola presenta 3.001 entidades persistidas, 31 transacciones, un backup verificado y un restore ensayado con una transacción posterior al punto de recuperación.

- Contratos: catorce schemas de persistencia, outbox, integridad y recuperación.
- Motor: `packages/control-plane-persistence/index.cjs`.
- Interfaz: `control-plane-recovery/app/`.
- Migración de referencia: `infra/cloudflare/migrations/0014_control_plane_persistence.sql`.
- Arquitectura: `docs/phase-24/CONTROL_PLANE_PERSISTENCE.md`.
- Transacciones y outbox: `docs/phase-24/TRANSACTIONS_AND_OUTBOX.md`.
- Backup y restore: `docs/phase-24/BACKUP_RESTORE.md`.
- Retención: `docs/phase-24/RETENTION_AND_INTEGRITY.md`.
- Runbook: `docs/phase-24/RECOVERY_RUNBOOK.md`.
- Validación: `docs/phase-24/VALIDATION.md`.

La base, los actores y los datos son sintéticos. No existe conexión con producción.

## Fase 23 — orquestación durable y reconciliación, versión 0.25.0

Esta entrega transforma decisiones de flota en trabajos idempotentes y limitados. Añade estado deseado y observado, reconciliación, colas por tenant, leases, concurrencia, ventanas, presupuesto, reintentos, dead-letter queue y recuperación explícita.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:orchestration
```

Abrir **http://127.0.0.1:4197/**. La consola muestra una simulación de 3.000 sitios, 1.500 trabajos, deduplicación total al repetir el reconciler, reintentos y fallos terminales aislados.

- Contratos: trece schemas de ejecución y reconciliación.
- Motor: `packages/fleet-orchestration/index.cjs`.
- Interfaz: `fleet-orchestration/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0013_fleet_orchestration.sql`.
- Arquitectura: `docs/phase-23/FLEET_ORCHESTRATION.md`.
- Idempotencia: `docs/phase-23/IDEMPOTENCY_AND_QUEUE.md`.
- Leases y recuperación: `docs/phase-23/LEASES_RETRIES_DLQ.md`.
- Reconciliación: `docs/phase-23/RECONCILIATION.md`.
- Runbook: `docs/phase-23/OPERATOR_RUNBOOK.md`.
- Validación: `docs/phase-23/VALIDATION.md`.

La implementación es local, sintética y `dry_run`. No contiene adaptadores de ejecución externos.

## Fase 22 — gobierno de flota y versiones, versión 0.24.0

Esta entrega registra versiones de recetas y sistemas visuales, valida compatibilidad con el motor, puntúa calidad por sitio y distribuye cambios mediante cohortes reversibles. También incorpora deriva, rollback con separación de funciones y planes de deprecación.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:fleet
```

Abrir **http://127.0.0.1:4196/**. La consola presenta doce sitios sintéticos, una cohorte sana al 25%, un ensayo revertido, una deriva crítica y el plan de sucesión de la receta 1.0.0.

- Contratos: once schemas para versiones, sitios, calidad, cohortes, deriva, rollback, deprecación y portafolio.
- Motor: `packages/fleet-governance/index.cjs`.
- Interfaz: `fleet-governance/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0012_fleet_governance.sql`.
- Arquitectura: `docs/phase-22/FLEET_GOVERNANCE.md`.
- Registro: `docs/phase-22/VERSION_REGISTRY.md`.
- Calidad y cohortes: `docs/phase-22/QUALITY_AND_COHORTS.md`.
- Ciclo de vida: `docs/phase-22/DRIFT_ROLLBACK_DEPRECATION.md`.
- Validación: `docs/phase-22/VALIDATION.md`.

La consola es local y de solo lectura. No ejecuta despliegues, DNS, publicaciones ni migraciones.

## Fase 21 — inteligencia de conversión y aprendizaje, versión 0.23.0

Esta entrega mide embudos, Web Vitals y calidad agregada sin admitir datos personales. Añade experimentos con muestra mínima, guardrails, revisión independiente y propuestas de aprendizaje que nunca publican ni modifican recetas automáticamente.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:conversion
```

Abrir **http://127.0.0.1:4195/**. La consola muestra un ganador controlado, una prueba con muestra insuficiente y otra detenida por LCP.

- Contratos: ocho schemas de eventos, snapshots, experimentos, resultados y aprendizaje.
- Motor: `packages/conversion-intelligence/index.cjs`.
- Interfaz: `conversion-intelligence/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0011_conversion_intelligence.sql`.
- Arquitectura: `docs/phase-21/CONVERSION_INTELLIGENCE.md`.
- Taxonomía: `docs/phase-21/EVENT_TAXONOMY.md`.
- Experimentos: `docs/phase-21/EXPERIMENT_PLAYBOOK.md`.
- Aprendizaje: `docs/phase-21/RECIPE_LEARNING.md`.
- Validación: `docs/phase-21/VALIDATION.md`.

La retención local es de 30 días y `auto_publish` permanece en `false`.

## Fase 20 — control de go-live e hypercare, versión 0.22.0

Esta entrega gobierna el lanzamiento después de la aceptación del piloto: change freeze, cuatro decisiones go/no-go, canary 5/25/50/100 ligado a SLO, rollback y controles de hypercare en lanzamiento, 24 y 72 horas.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:go-live
```

Abrir **http://127.0.0.1:4194/**. La consola muestra un run sintético cerrado después de 72 horas estables y otro detenido con rollback al 25%.

- Contratos: `go-live-plan`, `change-freeze-record`, `go-live-decision`, `canary-observation`, `rollback-trigger`, `hypercare-check`, `go-live-run` y `go-live-audit-event`.
- Motor: `packages/go-live-control/index.cjs`.
- Interfaz: `go-live-control/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0010_go_live_control.sql`.
- Arquitectura: `docs/phase-20/GO_LIVE_CONTROL.md`.
- Tablero: `docs/phase-20/GO_NO_GO_CHECKLIST.md`.
- Hypercare: `docs/phase-20/HYPERCARE_RUNBOOK.md`.
- Rollback: `docs/phase-20/ROLLBACK_POLICY.md`.
- Validación: `docs/phase-20/VALIDATION.md`.

El motor está limitado a `dry_run`: registra cero cambios externos, mensajes y publicaciones.

## Fase 19 — preparación y aceptación del piloto, versión 0.21.0

Esta entrega convierte el primer piloto en un expediente auditable: nueve requisitos con evidencia, cuatro revisiones independientes, siete aceptaciones del propietario, readiness calculado, ensayo local y un paquete sellado que no concede publicación.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:pilot-acceptance
```

Abrir **http://127.0.0.1:4193/**. La consola compara un expediente sintético que completa el ensayo con otro bloqueado por derechos de activos y evidencia pendiente.

- Contratos: `pilot-dossier`, `pilot-review-decision`, `owner-pilot-acceptance`, `launch-readiness-evaluation`, `launch-rehearsal`, `pilot-launch-package` y `pilot-acceptance-audit-event`.
- Motor: `packages/pilot-acceptance/index.cjs`.
- Interfaz: `pilot-acceptance/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0009_pilot_acceptance.sql`.
- Arquitectura: `docs/phase-19/PILOT_ACCEPTANCE.md`.
- Incorporación: `docs/phase-19/PILOT_INTAKE_CHECKLIST.md`.
- Revisión con el propietario: `docs/phase-19/OWNER_REVIEW_PLAYBOOK.md`.
- Ensayo: `docs/phase-19/LAUNCH_REHEARSAL_RUNBOOK.md`.
- Validación: `docs/phase-19/VALIDATION.md`.

Los registros son fixtures sintéticos. La aceptación demuestra el flujo, no constituye una firma legal, y el paquete conserva `may_publish: false`.

## Fase 18 — observabilidad, SLO y guardrails, versión 0.20.0

Esta entrega añade una torre de control local con telemetría cerrada y sin datos personales, SLO por servicio, límites técnicos por tenant, alertas deduplicadas, incidentes ligados al release y adaptadores de notificación que fallan cerrado.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:observability
```

Abrir **http://127.0.0.1:4192/**. El escenario sintético genera 20 eventos, una violación de SLO, una advertencia de almacenamiento, un incidente con rollback solicitado y cero mensajes externos.

- Contratos: `telemetry-event`, `slo-policy`, `slo-evaluation`, `tenant-guardrail-policy`, `usage-snapshot`, `operational-alert`, `incident-record` y `service-health-snapshot`.
- Motor: `packages/observability-guardrails/index.cjs`.
- Políticas: `ops/slo-policies.json` y `ops/tenant-guardrails.json`.
- Interfaz: `observability/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0008_observability.sql`.
- Arquitectura: `docs/phase-18/OBSERVABILITY_AND_GUARDRAILS.md`.
- Catálogo SLO: `docs/phase-18/SLO_CATALOG.md`.
- Runbook: `docs/phase-18/INCIDENT_RUNBOOK.md`.
- Validación: `docs/phase-18/VALIDATION.md`.

No existen precios, presupuestos monetarios, destinos de notificación ni telemetría real conectados.

## Fase 17 — adaptador Cloudflare y ensayo de staging, versión 0.19.0

Esta entrega traduce un release aprobado a un plan de recursos Cloudflare sin ejecutar cambios externos. El preflight enumera las configuraciones necesarias sin exponer valores, el Worker resuelve rutas multi-tenant sobre D1/R2 y el canary ensaya 5%, 25%, 50% y 100% con rollback automático.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:staging
```

Abrir **http://127.0.0.1:4191/**. El escenario completo funciona en `dry_run`, genera un despliegue exitoso y otro con fallo de digest al 25% para verificar rollback.

- Contratos: `cloudflare-deployment-plan`, `cloudflare-preflight`, `artifact-upload-plan`, `canary-check`, `deployment-execution` y `deployment-drift-report`.
- Motor: `packages/cloudflare-deployment/index.cjs`.
- Router comprobable: `packages/cloudflare-deployment/site-router.cjs`.
- Worker previsto: `workers/site-router/index.js`.
- Interfaz: `cloudflare-staging/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0007_cloudflare_deployments.sql`.
- Arquitectura: `docs/phase-17/CLOUDFLARE_STAGING.md`.
- Gates externos: `docs/phase-17/APPLY_GATES.md`.
- Validación: `docs/phase-17/VALIDATION.md`.

`apply` real permanece bloqueado. No se han usado tokens, cuentas, zonas, buckets, bases, colas, dominios ni endpoints reales.

## Fase 16 — control de publicación, versión 0.18.0

Esta entrega crea un plano de publicación local y auditable. Registra builds inmutables, exige QA y aprobación independiente, reserva dominios por tenant, mantiene una ruta activa por sitio y conserva cada promoción o rollback como un release nuevo.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:publication
```

Abrir **http://127.0.0.1:4190/**. La consola reproduce tres releases, un rollback y una purga idempotente con datos completamente sintéticos.

- Contratos: `publication-build`, `publication-release`, `tenant-route`, `domain-binding`, `cache-purge-request` y `publication-audit-event`.
- Motor: `packages/publication-control/index.cjs`.
- Interfaz: `publication-control/app/`.
- Persistencia prevista: `infra/cloudflare/migrations/0006_publication_control_plane.sql`.
- Arquitectura y límites: `docs/phase-16/PUBLICATION_CONTROL_PLANE.md`.
- Operación y recuperación: `docs/phase-16/OPERATIONS.md`.
- Validación: `docs/phase-16/VALIDATION.md`.

El adaptador real permanece sin configurar. No se ha desplegado contenido, cambiado DNS, creado Custom Hostnames ni purgado una caché externa.

## Fase 15 — claim, perfiles y capacidades, versión 0.17.0

Esta entrega separa identidad, propiedad del negocio, estado comercial y acceso efectivo. Incorpora claims con dos evidencias, revisión independiente, perfiles técnicos sin precios, eventos comerciales normalizados, grants temporales y snapshots de capacidades con denegación por defecto.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:claims
```

Abrir **http://127.0.0.1:4189/**. La consola usa evidencia, negocio, plan y eventos sintéticos. No procesa documentos reales ni pagos.

- Contratos: `business-claim`, `product-plan`, `subscription-state`, `billing-normalized-event`, `entitlement-grant` y `entitlement-snapshot`.
- Motor: `packages/claim-entitlements/index.cjs`.
- Perfiles: `commerce/plans.json`.
- Diseño: `docs/phase-15/CLAIM_AND_ENTITLEMENTS.md`.
- Decisiones pendientes: `docs/phase-15/PLAN_DECISIONS.md`.
- Validación: `docs/phase-15/VALIDATION.md`.

Los perfiles permanecen en borrador y el adaptador de billing real está sin configurar.

## Fase 14 — portal del propietario, versión 0.16.0

Esta entrega añade un portal local ligado a tenant: sesiones limitadas, CSRF, AAL2 reciente para revelar contactos, preferencias, solicitudes de privacidad, cambios del negocio bajo revisión y auditoría firmada.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:portal
```

Abrir **http://127.0.0.1:4188/**. La interfaz utiliza identidad, negocio, actividad y solicitudes ficticias. Es de solo lectura y no inicia sesiones reales.

- Contratos: `portal-session`, `owner-preferences`, `privacy-request`, `business-change-request` y `portal-audit-event`.
- Motor: `packages/owner-portal/index.cjs`.
- Interfaz: `owner-portal/app/`.
- Permisos: `docs/phase-14/PERMISSIONS.md`.
- Arquitectura y límites: `docs/phase-14/OWNER_PORTAL.md`.
- Validación: `docs/phase-14/VALIDATION.md`.

La conexión a identidad real y la exposición del portal en Internet permanecen bloqueadas.

## Fase 13 — bandeja privada multi-tenant, versión 0.15.0

Esta entrega convierte las interacciones aceptadas en casos operativos sin copiar datos personales. Incorpora aislamiento por tenant, asignación, estados, SLA, notas cifradas, concurrencia optimista y entregas idempotentes mediante adaptadores.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:inbox
```

Abrir **http://127.0.0.1:4187/**. La bandeja contiene cuatro casos visuales ficticios y es de solo lectura.

- Contratos: `lead-case`, `lead-note`, `lead-event` y `delivery-attempt`.
- Motor: `packages/lead-inbox/index.cjs`.
- Interfaz: `lead-inbox/app/`.
- Decisión: `docs/adr/ADR-021-private-inbox-and-delivery-ports.md`.
- Diseño operativo: `docs/phase-13/PRIVATE_INBOX.md`.
- Validación: `docs/phase-13/VALIDATION.md`.

Correo, WhatsApp y CRM permanecen desconectados hasta elegir proveedores y configurar identidad, secretos y destinos autorizados.

## Fase 12 — interacción privada, versión 0.14.0

Esta entrega incorpora el límite privado que debe existir antes de habilitar formularios en los sitios. Valida una lista cerrada de campos, registra consentimiento versionado, separa marketing, aplica cinco controles antiabuso, cifra los registros y asigna su fecha de eliminación desde el primer momento.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:interactions
```

Abrir **http://127.0.0.1:4186/**. La consola es una explicación local de solo lectura; no contiene un formulario conectado ni recibe contactos reales.

- Contratos: `consent-receipt`, `interaction-submission` e `interaction-rejection`.
- Motor: `packages/interaction-privacy/index.cjs`.
- Interfaz: `interaction-privacy/app/`.
- Diseño y límites: `docs/phase-12/PRIVATE_INTERACTIONS.md`.
- Plantilla editable: `docs/phase-12/PRIVACY_NOTICE_TEMPLATE.md`.
- Resultado: `docs/phase-12/VALIDATION.md`.

La activación pública permanece bloqueada hasta configurar desafío anti-bot, secretos, entrega transaccional, identidad, retención automática y revisión legal del aviso.

Monorepo inicial para ejecutar el Master Blueprint.

## Fase 11 — registro, uso y revocación de activos, versión 0.13.0

Esta entrega conecta las imágenes sintéticas del piloto con el renderer. Cada archivo se detecta por firma, se mide, se identifica por SHA-256 y recibe una política de elegibilidad. El build produce además un índice inverso que enumera todas las páginas que usan cada activo.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:asset-usage
```

Abrir **http://127.0.0.1:4185/** para revisar la trazabilidad.

- Registro generado: `dist/visual-pilot/asset-registry.json`.
- Índice inverso: `dist/visual-pilot/asset-usage-index.json`.
- Vista humana: `dist/visual-pilot/asset-trace.html`.
- Núcleo: `packages/asset-publication/`.
- Contratos: `site-asset-registry.schema.json` y `asset-usage-index.schema.json`.
- Especificación: `docs/phase-11/ASSET_PUBLICATION.md`.
- Validación: `docs/phase-11/VALIDATION.md`.

Los tres activos actuales tienen estado `synthetic_fixture`: pueden renderizarse únicamente en la demo local `noindex`. No son equivalentes a `web_ready` y el gate los rechaza en entornos privados o productivos.

## Fase 10 — experiencias inmobiliarias diferenciadas, versión 0.12.0

Esta entrega integra un módulo de decisión específico dentro de cada una de las cinco direcciones visuales. Ya no cambian únicamente el tono y la composición: cada modelo organiza una tarea distinta del cliente.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:experience
```

Abrir **http://127.0.0.1:4184/** y entrar en cualquiera de los cinco perfiles.

- Catálogo amplio: búsqueda guiada por intención, zona, formato y presupuesto.
- Desarrolladora: cronología del proyecto y estados que requieren verificación.
- Asesor boutique: diagnóstico inicial del momento del cliente.
- Proyectos y lotes: comparación responsable de condiciones críticas.
- Tasación: brief estructurado para una evaluación humana.

El modelo valida contra `contracts/real-estate-experience.schema.json`, se genera en `packages/real-estate-experience/` y se incorpora al renderer profesional. Todos los controles permanecen desactivados en la demo: no capturan datos ni activan contacto.

- Especificación: `docs/phase-10/REAL_ESTATE_EXPERIENCES.md`.
- Matriz de categorías: `docs/phase-10/CATEGORY_MATRIX.md`.
- Validación: `docs/phase-10/VALIDATION.md`.

## Fase 9 — pipeline seguro de activos, versión 0.11.0

Esta entrega convierte fotografías, logos, documentos y videos en objetos con un ciclo de vida explícito. La extensión del archivo no se considera evidencia: el pipeline inspecciona firma binaria, tipo declarado, tamaño, dimensiones y marcadores activos antes de aceptar la cuarentena.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:assets
```

Abrir **http://127.0.0.1:4183/**. La consola usa un PNG mínimo sintético y no recibe cargas desde el navegador.

- Contrato: `contracts/asset-processing-record.schema.json`.
- Inspector y máquina de estados: `packages/asset-pipeline/`.
- Consola: `asset-pipeline/app/` y `dist/asset-pipeline/`.
- Especificación: `docs/phase-9/ASSET_PIPELINE.md`.
- Adaptadores pendientes: `docs/phase-9/PROVIDER_PORTS.md`.
- Validación: `docs/phase-9/VALIDATION.md`.

La inspección local, la política de derechos, las variantes requeridas y la revocación son ejecutables. El escáner antimalware y el transformador de imágenes reales permanecen como puertos sin proveedor; por eso no se admite ningún activo real ni despliegue.

## Fase 8 — adaptadores de infraestructura, versión 0.10.0

Esta entrega separa el motor privado de los proveedores concretos. Incluye seis puertos para identidad, metadatos, claves, objetos privados, colas y análisis antimalware; todos tienen una ruta local comprobable o una política de denegación segura.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:infrastructure
```

Abrir **http://127.0.0.1:4182/**. La consola muestra qué funciona localmente y cuáles son las entradas pendientes del perfil Cloudflare. No contiene cuentas, tokens ni secretos.

- Contratos: `contracts/infrastructure-profile.schema.json` e `infrastructure-readiness.schema.json`.
- Adaptadores locales y preflight: `packages/infrastructure-adapters/`.
- Perfiles: `infra/profiles/local.json` y `cloudflare-production.json`.
- Plano Cloudflare: `infra/cloudflare/` con ejemplo de Wrangler y migración D1.
- Consola: `infrastructure/app/` y `dist/infrastructure/`.
- Especificación: `docs/phase-8/INFRASTRUCTURE_ADAPTERS.md`.
- Entradas externas: `docs/phase-8/DEPLOYMENT_INPUTS.md`.
- Validación: `docs/phase-8/VALIDATION.md`.

El modo local es ejecutable. El perfil de producción es deliberadamente `configuration_only`: incluso con todas las variables presentes, `may_publish` continúa en `false`. No se ha creado, modificado ni desplegado ningún recurso de Cloudflare.

## Fase 7 — base privada de desarrollo, versión 0.9.0

Esta versión añade una bóveda local cifrada, permisos por rol y negocio, auditoría encadenada y firmada, retención, eliminación con lápida y cuarentena de activos.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:foundation
```

Abrir **http://127.0.0.1:4181/**. La consola es sintética y explica los controles ejecutados por el núcleo. No contiene claves, sesiones ni registros reales.

El cifrado usa AES-256-GCM con contexto autenticado. Las claves deben recibirse como 32 bytes desde variables de entorno o un gestor de secretos; no existen valores predeterminados ni claves guardadas en el repositorio.

- Contratos: `contracts/private-vault-record.schema.json`, `asset-intake.schema.json` y `audit-entry.schema.json`.
- Núcleo: `packages/private-foundation/index.cjs`.
- Fixture de activo: `foundation/synthetic-asset.json`.
- Consola: `foundation/app/` y `dist/private-foundation/`.
- Especificación: `docs/phase-7/PRIVATE_FOUNDATION.md`.
- Validación: `docs/phase-7/VALIDATION.md`.

Esta es una base de desarrollo comprobable. No sustituye un proveedor de identidad, KMS, almacenamiento de objetos privado, antivirus, base de datos transaccional ni gestión legal de retención.

## Fase 6 — generador de demos privadas, versión 0.8.0

Esta versión cierra la primera cadena autorizada: OwnerSubmission confirmado → BusinessTruth idéntico → OperatorReview vigente → demo privada. Ningún documento por separado puede activar el renderer.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:private
```

Abrir **http://127.0.0.1:4180/**. La demo usa exclusivamente el negocio ficticio Horizonte Casa y ofrece una página de trazabilidad con los hashes del propietario, BusinessTruth y revisión.

La salida es inmutable, `noindex`, local y `not_published`. No contiene formularios, scripts, enlaces externos ni acciones de contacto. El Site Engine sintético no fue relajado: las fuentes de propietario pasan por una compuerta privada independiente.

- Contrato: `contracts/private-demo-build.schema.json`.
- Autorización y renderer: `packages/private-demo/`.
- Build: `scripts/build-private-demo.cjs`.
- Salida: `dist/private-demo/`.
- Especificación: `docs/phase-6/PRIVATE_DEMO.md`.
- Validación: `docs/phase-6/VALIDATION.md`.

## Fase 5 — review gate interno, versión 0.7.0

Esta versión añade una bandeja interna para revisar expedientes generados por el onboarding. Cada decisión se vincula al SHA-256 exacto de OwnerSubmission, incluye controles estructurados y produce un registro de auditoría exportable.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:review
```

Abrir **http://127.0.0.1:4179/**. La cola contiene tres negocios ficticios: uno listo, uno sin derechos de activos y un borrador incompleto.

Una aprobación concede únicamente `may_generate_private_demo: true`. `may_publish` y `may_index` permanecen siempre en `false`. Si cambia cualquier byte semántico del expediente, el hash deja de coincidir y la revisión queda obsoleta.

- Contrato: `contracts/operator-review.schema.json`.
- Núcleo: `packages/operator-review/index.cjs`.
- Interfaz: `review/app/`.
- Fixtures: `review/fixtures/`.
- Salida: `dist/review/`.
- Especificación: `docs/phase-5/REVIEW_GATE.md`.
- Validación: `docs/phase-5/VALIDATION.md`.

## Fase 4 — onboarding verificable del propietario, versión 0.6.0

Esta versión añade el primer camino seguro desde información entregada por un propietario hacia BusinessTruth. El formulario local recoge identidad, enfoque, zonas, servicios, canal público, procedencia de activos y cuatro confirmaciones explícitas.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:onboarding
```

Abrir **http://127.0.0.1:4178/**. La interfaz contiene un expediente ficticio precargado para probar el recorrido sin introducir información real.

El resultado puede habilitar la preparación de una demo privada, pero nunca publicación automática. La transformación conserva una fuente de tipo `owner`, provenance `owner_verified`, derechos `needs_review`, `may_index_demo: false` y `requires_human_review: true`.

- Contrato: `contracts/owner-submission.schema.json`.
- Núcleo: `packages/owner-onboarding/index.cjs`.
- Interfaz: `onboarding/app/`.
- Fixture: `onboarding/synthetic-owner-submission.json`.
- Salida construida: `dist/onboarding/`.
- Especificación: `docs/phase-4/OWNER_ONBOARDING.md`.
- Validación: `docs/phase-4/VALIDATION.md`.

## Fase 3 — motor visual inmobiliario, versión 0.5.0

Esta versión conecta el motor central y sus contratos con cinco composiciones visuales profesionales. Cada perfil pasa primero por los gates de BusinessTruth, VerticalRecipe, BrandProfile y SiteConfig; solo entonces se generan su portada y tres fichas interiores.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:visual
```

Abrir **http://127.0.0.1:4177/**. La galería permite comparar:

- catálogo inmobiliario amplio;
- desarrolladora de proyectos;
- asesoría boutique;
- proyectos y lotes;
- tasación y estrategia para propietarios.

La entrega genera 20 páginas de perfil, usa tres propiedades e imágenes sintéticas y mantiene todas las salidas como `noindex` y `not_published`. No contiene formularios, teléfonos, correos, dominios externos ni identidad de los candidatos reales usados para estudiar requisitos.

- Renderer: `packages/real-estate-renderer/`.
- Catálogo ficticio: `pilot/catalog.json`.
- Salidas: `dist/visual-pilot/`.
- Arquitectura y límites: `docs/phase-3/VISUAL_INTEGRATION.md`.
- Resultado de validación: `docs/phase-3/VALIDATION.md`.

## Fase 2 — adaptador de perfiles y piloto sintético, versión 0.4.0

Esta versión conserva el motor y los contratos de Fase 1 e incorpora un adaptador central que genera cinco perfiles inmobiliarios sintéticos a partir de una definición compacta. Los candidatos reales analizados solo se usan como modelos internos de requisitos; sus nombres, fotografías, teléfonos, propiedades y textos no aparecen en las demos.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:pilot
```

Abrir **http://127.0.0.1:4176/**. El índice muestra cinco negocios ficticios: catálogo amplio, desarrollador de proyectos, asesor boutique, proyectos/lotes y tasación para propietarios. Todos permanecen `noindex`, sin formularios ni publicación.

- Definiciones: `pilot/profiles.json`.
- Adaptador: `packages/profile-adapter/index.cjs`.
- Entradas generadas: `pilot/generated-inputs/`.
- Salidas: `dist/pilot/` y `dist/pilot/pilot-manifest.json`.
- Análisis de candidatos: carpeta hermana `analisis-candidatos-inmobiliarios/` del proyecto local.

Las pruebas confirman aislamiento de IDs, fuentes sintéticas, referencias de hashes, validación contractual y bloqueo de publicación. La siguiente integración debe sustituir el render informativo básico por las composiciones profesionales del piloto visual 0.5.0 sin relajar los gates.

## Fase 1 conservada — motor local ejecutable, versión 0.3.0

**Ya genera una demo real desde los cuatro documentos de entrada.** Incluye HTML,
CSS, manifiesto SiteSnapshot, comprobaciones del motor y QA automatizado en navegador.
Los datos siguen siendo ficticios y no se publica nada en Internet.

### Abrir en Windows

1. Extraer el ZIP completo a una carpeta.
2. Tener Node.js 18 o superior instalado.
3. Abrir `INICIAR.cmd`. En el primer uso descargará las dependencias del proyecto.
4. Abrir **http://127.0.0.1:4173** y mantener abierta la ventana del servidor.
5. Usar Ctrl+C en esa ventana para detenerlo.

Para mirar la demo sin instalar herramientas, abrir el `index.html` dentro de
`dist/site-golden-001/` y su subcarpeta de build. La vista HTTP añade las restricciones
de cabeceras del servidor y es la que se usa para las pruebas.

### Comandos

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run qa:browser
npm start
```

`qa:browser` requiere Chrome instalado; las instrucciones para Edge o Chromium
están en `docs/phase-1/LOCAL_ENGINE.md`. En PowerShell se puede usar `npm.cmd`.
`npm run check` ejecuta pruebas, build y QA en secuencia. El ZIP no incluye node_modules.

Documentación de esta entrega:

- `docs/phase-1/LOCAL_ENGINE.md`: arquitectura, uso, límites y siguientes pasos.
- `docs/phase-1/VALIDATION.md`: resultados, alcance y revisión pendiente.
- `dist/latest.json`: ubicación del build generado.
- `dist/<site>/<build>/site-snapshot.json`: hashes y estado real de QA.
- `dist/<site>/<build>/qa/`: informe de navegador y capturas móvil/escritorio.

Los contratos y ejemplos originales de Phase 0 se conservan. Los documentos en
`examples/` siguen siendo fixtures; los archivos en `dist/` son la salida ejecutada
del nuevo motor. El gate para usar datos reales sigue pendiente.

## Base conservada de Phase 0 — paquete 0.2.0

Esta versión conserva los tres contratos originales en `0.1.0` y añade BrandProfile,
SiteSnapshot, AgentOutput y seis tipos de eventos. La versión del paquete no cambia
la versión de los documentos. No es todavía un Site Engine ni un sistema desplegado.

Para validar (Node.js 18 o superior):

```sh
npm ci --ignore-scripts
npm test
```

En PowerShell, si la política de scripts bloquea `npm`, usa `npm.cmd`.
La instalación inicial descarga las dependencias fijadas en `package-lock.json`.
Después, la validación es local y no consulta los dominios de los `$id`.

- Especificación y límites: `docs/phase-0/CONTRACTS.md`.
- Resultado de las comprobaciones: `docs/phase-0/VALIDATION.md`.
- Ejemplos ficticios: `examples/golden-business/`.
- Estado y próximos pasos: `docs/phase-0/WORKPLAN.md`.

Golden path: **BusinessTruth + VerticalRecipe → BrandProfile → SiteConfig →
SiteSnapshot → AgentOutput / Events**. La receta es una entrada de configuración,
no una transformación que sustituya BusinessTruth.

Los ejemplos son sintéticos y de uso interno. No incluyen datos reales del usuario,
contactos, direcciones, reseñas ni precios. El HTML en `examples/golden-business/snapshot/`
es una muestra local estática; no acredita renderizado por un motor ni QA de navegador.

## Fuente de verdad

1. `docs/TODOLIMA_HAZLOCRECER_MASTER_BLUEPRINT.md`
2. `contracts/*.schema.json`
3. `docs/adr/*`
4. Código implementado y tests

Los chats, prompts y agentes son herramientas de trabajo; nunca son la fuente de verdad del proyecto.

## Orden de implementación

1. Phase 0: provenance + contratos.
2. Golden Path: un negocio -> BusinessTruth -> VerticalRecipe -> SiteConfig -> render -> QA -> demo.
3. Factory de 10 negocios.
4. Claim + billing + onboarding.
5. Portal cliente + dominio propio.
6. Expansión por verticales y agentes.

## Reglas

- No publicar hechos del negocio sin provenance.
- Demos `noindex` por defecto.
- No desplegar un proyecto independiente por negocio durante el MVP.
- Todo output de agentes que alimente automatización debe validar contra JSON Schema.
- Cambios arquitectónicos relevantes requieren ADR.
