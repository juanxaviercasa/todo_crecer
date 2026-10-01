# TODOLIMA + HAZLOCRECER — MASTER BLUEPRINT

**Versión:** 1.0  
**Fecha de análisis:** 28 de septiembre de 2026  
**Estado:** Blueprint estratégico y técnico para validación y ejecución  
**Alcance:** TodoLima.com + GuiaLima.online + HazloCrecer.com + plataforma SaaS + fábrica de sitios + automatización + agentes IA + crecimiento  

> **Principio rector:** construir una plataforma que entregue y opere presencia digital, no una agencia que dependa de trabajo manual por cliente.

---

## Cómo usar este documento

Este archivo es la **fuente de verdad inicial** del proyecto. Debe utilizarse para:

- tomar decisiones de arquitectura;
- dividir el trabajo en módulos;
- crear prompts específicos para agentes de programación;
- evaluar herramientas antes de integrarlas;
- evitar que cada nuevo chat, desarrollador o agente reinvente el sistema;
- registrar qué decisiones son permanentes, cuáles son provisionales y cuándo deben revisarse.

El documento **no pretende congelar la tecnología**. Separa deliberadamente la lógica de negocio de los proveedores. Los modelos de IA, hosting, analítica, pagos, correo y demás servicios deben poder sustituirse mediante adaptadores cuando sea económicamente razonable.

---

# 0. Decisiones ejecutivas — lo que sí y lo que no

Antes de entrar en detalle, estas son las decisiones de mayor impacto.

### Sí hacer

1. **TodoLima.com = directorio y distribución.** Mantenerlo útil, limpio y centrado en descubrimiento de negocios.
2. **GuiaLima.online = entorno de demostración.** Las demos viven allí y, por defecto, no compiten en buscadores con el sitio oficial del negocio.
3. **HazloCrecer.com = marca comercial.** Marketing, funnels, planes, checkout, casos, blog y entrada al SaaS.
4. **Una sola plataforma multi-tenant.** No crear un servidor, repositorio o proyecto de hosting por negocio.
5. **Un Site Engine compartido + configuración por negocio.** El código base se versiona una vez; cada sitio es una combinación de datos, receta vertical, diseño, assets y módulos habilitados.
6. **Cloudflare como capa pública principal.** DNS, CDN, SSL, routing wildcard, Workers, R2, custom hostnames y protección.
7. **GitHub para código, CI y versionado; no como hosting comercial masivo.** GitHub Pages documenta que no está pensado como hosting gratuito para negocio/SaaS.
8. **PostgreSQL como fuente de verdad.** Configuración, estados, facturación, ownership, leads, eventos y auditoría viven en datos estructurados.
9. **Automatización first, humano por excepción.** El operador ve colas de revisión, no todos los trabajos.
10. **n8n como sistema de integración, no como núcleo de negocio.** Webhooks, correo, CRM, notificaciones y APIs; la máquina de estados y reglas críticas viven en código/DB.
11. **Model Router desde el primer día.** Qwen, Gemini, OpenAI, Anthropic u otros son proveedores intercambiables.
12. **Kaggle + túnel = laboratorio.** Útil para probar Qwen; no se usa como dependencia SLA de producción.
13. **Cline/OpenHands se reutilizan.** No construir un coding agent desde cero.
14. **Demos `noindex` por defecto.** Solo se indexan propiedades que aporten valor independiente, tengan procedencia de datos clara y/o hayan sido reclamadas/verificadas.
15. **Business Truth Layer.** La IA puede redactar y proponer; no puede inventar hechos del negocio.
16. **Pago → webhook → entitlements → provisioning.** El sistema nunca depende de que alguien “revise si ya pagó”.
17. **Billing Adapter.** Mercado Pago, Culqi u otro proveedor se conectan detrás de una interfaz; no se acopla el producto a uno solo.
18. **Assets fuera de GitHub.** Logos, fotografías, screenshots, PDFs y videos en object storage (R2 como primera opción).
19. **Versiones de sitio y rollback.** Todo cambio debe poder previsualizarse, aprobarse y revertirse.
20. **Medir resultados, no páginas generadas.** El funnel central es Demo → Claim → Pago → Activación → Lead → Retención → Expansión.

### No hacer

1. No crear 3.800, 10.000 o 50.000 repositorios para sitios similares.
2. No crear 3.800 proyectos Cloudflare Pages/GitHub Pages.
3. No indexar decenas de miles de demos genéricas esperando que el SEO “haga el resto”.
4. No utilizar datos obtenidos de Google Maps sin revisar sus derechos de uso y procedencia.
5. No reclamar Google Business Profiles sin autorización expresa del propietario.
6. No hacer outreach masivo por WhatsApp sin opt-in válido.
7. No “sumar cuentas gratuitas” para evadir límites publicados de proveedores.
8. No permitir que agentes con terminal/código operen sobre producción sin sandbox, permisos y gates.
9. No regenerar un sitio completo por un cambio de WhatsApp o horario.
10. No construir un WordPress genérico: construir solo la administración que este negocio necesita.

---

# 1. Executive Summary

La oportunidad no consiste en vender páginas web una por una. Consiste en transformar un activo existente —el catálogo de negocios de TodoLima— en un **motor de adquisición, demostración, entrega y crecimiento digital altamente automatizado**.

La arquitectura propuesta se divide en cuatro superficies:

- **TodoLima.com:** directorio de descubrimiento y fuente de demanda/prospectos.
- **GuiaLima.online:** infraestructura de demos identificadas y reclamables.
- **HazloCrecer.com:** marca comercial, contenido, venta, checkout y educación.
- **Core Platform:** SaaS privado multi-tenant que controla datos, sitios, claims, billing, dominios, analytics, agentes y operaciones.

El sistema no debe generar un sitio “a ciegas” para cada registro. Primero debe **calificar** cada oportunidad. Los mejores prospectos reciben auditoría profunda y demo completa; los medianos reciben auditoría y preview ligero; los de baja prioridad permanecen como fichas del directorio. Así se reducen costes de IA y operaciones y se concentra inversión donde existe probabilidad comercial.

La arquitectura técnica recomendada es **multi-tenant y orientada a eventos**. Un único motor de sitios resuelve hostnames de `*.guialima.online`, obtiene una configuración versionada y sirve un resultado estático/caché altamente rápido. Los dominios de clientes se conectan posteriormente mediante Cloudflare for SaaS/Custom Hostnames. El contenido y configuración se almacenan en PostgreSQL; los assets y snapshots se guardan en R2; GitHub almacena el código fuente de la plataforma, no el contenido de cada negocio.

La IA se implementa como **capacidad sustituible**. Cloudflare AI Gateway puede convertirse en la puerta única hacia Workers AI y proveedores externos, con logging, costes, retries y fallbacks. Qwen puede utilizarse para tareas de código y generación económica; Gemini u otros modelos pueden realizar visión, razonamiento o contenido; modelos premium solo se utilizan cuando su mejora de calidad justifica el coste.

El mayor riesgo detectado no es técnico: es **datos, cumplimiento y calidad**. Los términos actuales de Google Maps prohíben scraping y rehosting de contenido de Maps; por ello el dataset existente necesita una fase de remediación de procedencia. Además, las demos masivas no deben convertirse en contenido de bajo valor o páginas doorway. La estrategia SEO correcta es indexar únicamente páginas útiles y legítimas; las demos comerciales se mantienen `noindex` hasta cumplir criterios de publicación.

La ventaja competitiva potencial no será “usar IA”. Será combinar:

- dataset local estructurado y legítimo;
- distribución de TodoLima;
- recetas de conversión por vertical;
- Business Truth Layer;
- fábrica de sitios con QA;
- claim + billing + activación automática;
- telemetría de conversión;
- bucles de aprendizaje por categoría;
- servicios recurrentes activables.

---

# 2. Vision

## 2.1 Visión de producto

Crear una **AI Digital Business Factory** capaz de transformar un negocio identificado en una presencia digital medible y, si el propietario lo desea, en una plataforma activa de captación y crecimiento.

La máquina ideal recibe:

`Business Record`

Y puede producir:

`Business Truth → Audit → Brand Profile → Site Spec → Website → QA → Demo → Analytics → Claim → Payment → Onboarding → Custom Domain → Active Site → Leads → Automations → AI Agents → Growth`.

## 2.2 Visión operacional

El objetivo no es “cero humanos”. El objetivo es **máximo throughput por operador**.

Un operador no debería abrir 500 sitios para revisarlos manualmente. Debería abrir un dashboard y ver:

- 467 trabajos aprobados automáticamente;
- 21 que requieren revisión;
- 8 bloqueados por inconsistencias;
- 4 pagos fallidos;
- 2 disputas de propiedad.

## 2.3 Visión económica

El sitio web es el producto de entrada. La recurrencia proviene de:

- mantenimiento/plataforma;
- dominio/gestión técnica;
- analytics;
- SEO/local SEO;
- reservas/lead capture;
- automatizaciones;
- WhatsApp/CRM;
- asistentes/agentes IA;
- contenido y marketing;
- optimización continua.

La métrica de éxito de la fábrica no será “sitios creados”, sino **margen por cliente, conversión a pago, retención y expansión de MRR**.

---

# 3. Business Model

## 3.1 Modelo recomendado

Modelo híbrido **product-led + service-assisted SaaS**.

### Capa gratuita/adquisición

- ficha en TodoLima;
- auditoría ligera;
- preview/demo para prospectos calificados;
- CTA “Reclamar sitio”.

### Activación pagada

Pago inicial opcional para:

- verificación y onboarding;
- personalización;
- conexión de dominio;
- puesta en producción;
- configuración de conversiones;
- migración de assets/contenido.

### Suscripción

Mantiene:

- infraestructura;
- SSL/CDN;
- dashboard;
- actualizaciones;
- analytics;
- backup/versiones;
- soporte según plan;
- módulos habilitados.

### Add-ons

- SEO avanzado;
- chatbot/agente;
- reservas;
- automatización de leads;
- campañas;
- creación de contenido;
- llamadas/voice agents;
- reporting premium;
- personalización de diseño.

## 3.2 Lo que no conviene vender

No vender “IA”, “tokens”, “agentes” o “automatizaciones” como conceptos técnicos. Vender resultados:

- más solicitudes;
- más reservas;
- más contactos;
- menor tiempo de respuesta;
- mejor conversión;
- administración más sencilla.

## 3.3 Segmentación por economía

No todas las 38 categorías tienen el mismo valor. Crear un **Vertical Economics Score** con:

- ticket promedio estimado del negocio;
- valor potencial de un lead;
- frecuencia de compra;
- margen digitalizable;
- disponibilidad de contacto;
- competencia local;
- urgencia de conversión;
- necesidad de reservas/citas;
- madurez digital.

Priorizar verticales donde un solo cliente nuevo pueda justificar varios meses de suscripción.

---

# 4. Ecosystem of Brands

## TodoLima.com — Discovery Layer

Responsabilidad:

- directorio;
- búsquedas por categoría/zona;
- páginas de categoría útiles;
- ficha de negocio;
- `Ver sitio` cuando exista demo o web;
- `Reclamar` discretamente;
- autoridad local a largo plazo.

No debe parecer una agencia.

## GuiaLima.online — Demo Layer

Responsabilidad:

- demos;
- previews;
- banner de demo/reclamación;
- entorno de pruebas;
- URLs compartibles.

Recomendación de hostname:

`<slug>-<business_id>.guialima.online`

Ejemplo:

`clinica-sonrisa-3821.guialima.online`

El `business_id` evita colisiones y el slug conserva legibilidad.

## HazloCrecer.com — Commercial Layer

Responsabilidad:

- propuesta de valor;
- pricing;
- funnels;
- checkout;
- blog/casos;
- onboarding;
- login al portal;
- venta de add-ons;
- educación.

## Core Platform — Operations Layer

No necesita una marca pública distinta inicialmente. Puede vivir en:

- `app.hazlocrecer.com` — cliente;
- `admin.hazlocrecer.com` — operaciones;
- `api.hazlocrecer.com` — API;
- `assets.guialima.online` o `assets.hazlocrecer.com` — assets.

---

# 5. Customer Journey

## 5.1 Prospecto sin sitio

1. TodoLima contiene la ficha.
2. Qualification Engine puntúa la oportunidad.
3. Si supera threshold, se crea auditoría y demo.
4. QA aprueba.
5. Se publica en GuiaLima con `noindex` y banner de demo.
6. Se registra telemetría.
7. Se realiza outreach permitido o el propietario descubre la página.
8. Propietario pulsa Claim.
9. Claim Verification confirma identidad/autoridad.
10. Selecciona plan.
11. Checkout.
12. Webhook de pago crea/activa subscription.
13. Onboarding confirma datos.
14. Se genera versión final.
15. QA.
16. Se conecta dominio.
17. Demo redirige/canonicaliza al dominio oficial cuando corresponda.
18. Dashboard comienza a mostrar resultados.
19. Growth Engine ofrece módulos basados en datos.

## 5.2 Prospecto con web existente

No generar automáticamente un reemplazo completo en todos los casos.

1. Auditar web actual.
2. Calcular Opportunity Score.
3. Si la web es razonable, ofrecer mejoras/automatización en vez de reemplazo.
4. Si existe una oportunidad clara, producir redesign preview.
5. Comparativa “actual vs propuesta” basada en métricas objetivas.

## 5.3 Cliente activo

El cliente administra datos, no código.

Ejemplo:

`Cambiar WhatsApp → Preview diff → Confirmación → nueva SiteVersion → QA ligero → Publish`.

---

# 6. Product Architecture

La plataforma se divide en dominios funcionales:

1. **Business Registry** — negocios y fuentes.
2. **Truth & Provenance** — datos verificables.
3. **Qualification** — prioridad comercial.
4. **Audit** — diagnóstico.
5. **Brand Intelligence** — identidad/diseño.
6. **Site Factory** — generación.
7. **QA** — gates.
8. **Publishing** — snapshots/deploy/routing.
9. **Claim** — propiedad.
10. **Identity/Auth** — usuarios y organizaciones.
11. **Billing** — pagos/suscripciones.
12. **Entitlements** — módulos disponibles.
13. **Customer Portal** — autoservicio.
14. **Analytics** — eventos/conversiones.
15. **CRM** — pipeline comercial.
16. **Agents** — tareas de IA.
17. **Automations** — integrations/workflows.
18. **Growth** — recomendaciones/experimentos.
19. **Operations** — excepciones, auditoría, observabilidad.

---

# 7. Technical Architecture

## 7.1 Arquitectura lógica objetivo

```text
                         ┌──────────────────────┐
                         │      TODOLIMA        │
                         │ discovery/directory │
                         └──────────┬───────────┘
                                    │
                             Business Registry
                                    │
                 ┌──────────────────▼──────────────────┐
                 │        QUALIFICATION ENGINE        │
                 └──────────┬───────────────┬──────────┘
                            │               │
                         Audit          Research
                            └───────┬───────┘
                                    ▼
                           BUSINESS TRUTH
                                    │
                                    ▼
                        BRAND + SITE SPEC
                                    │
                                    ▼
                           AI SITE FACTORY
                                    │
                                    ▼
                                QA GATE
                                    │
                                    ▼
                         GUIALIMA DEMO LAYER
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                 Traffic          Claim          Analytics
                                    │
                                    ▼
                              HAZLOCRECER
                                    │
                         Verify → Checkout
                                    │
                                    ▼
                         BILLING / ENTITLEMENTS
                                    │
                                    ▼
                           CUSTOMER PORTAL
                                    │
                      Content/Domain/Features
                                    │
                                    ▼
                              PRODUCTION SITE
                                    │
                   ┌────────────────┼────────────────┐
                   ▼                ▼                ▼
                 Leads           Agents           Growth
                   └────────────────┼────────────────┘
                                    ▼
                              Recurring Revenue
```

## 7.2 Separación de planos

### Data Plane público

- Cloudflare Worker/site router;
- CDN/cache;
- static/site snapshots;
- R2 assets;
- custom domains.

### Control Plane privado

- API administrativa;
- PostgreSQL;
- queues;
- n8n;
- AI job runner;
- OpenHands/agent runtime;
- admin dashboard;
- schedulers.

### AI Plane

- AI Gateway;
- provider adapters;
- prompt registry;
- model policies;
- traces/costs;
- output validation.

Esta separación permite que una caída del runner de IA no tumbe los sitios públicos.

---

# 8. AI Architecture

## 8.1 Regla base

La IA **propone o transforma**. El sistema determinista **valida y ejecuta**.

Ejemplo incorrecto:

`LLM dice “deploy realizado” → marcar ACTIVE`.

Ejemplo correcto:

`LLM genera → build real → test real → HTTP health check → estado ACTIVE`.

## 8.2 Tipos de uso de IA

- extracción estructurada;
- clasificación;
- copy;
- diseño/brand reasoning;
- generación de Site Spec;
- programación;
- revisión visual;
- scoring auxiliar;
- soporte;
- recomendaciones growth.

## 8.3 AI Gateway

Recomendación: **Cloudflare AI Gateway como gateway primario inicial**.

Ventajas actuales:

- múltiples proveedores;
- Workers AI;
- OpenAI-compatible endpoint;
- retries;
- fallbacks;
- logging/cost/latency;
- custom providers para endpoints propios;
- rate limiting y observabilidad.

Esto permite insertar un endpoint Qwen propio en el futuro sin reescribir consumidores.

## 8.4 Prompts versionados

Nunca almacenar prompts críticos dispersos en n8n o código hardcodeado.

Crear `PromptRegistry`:

- `prompt_key`;
- `version`;
- `system_prompt`;
- `input_schema`;
- `output_schema`;
- `model_policy`;
- `temperature`;
- `created_at`;
- `evaluation_set`;
- `status`.

Cada `AgentRun` registra qué versión produjo el resultado.

---

# 9. Agent Architecture

## 9.1 No empezar con veinte agentes

El MVP debe tener cinco capacidades lógicas, aunque internamente algunas compartan el mismo modelo:

1. **Research/Truth Agent**
2. **Brand + Content Agent**
3. **Site Planning Agent**
4. **Coding/Site Build Agent**
5. **QA/Review Agent**

Después se separan cuando exista evidencia de que mejora calidad/coste.

## 9.2 Evolución recomendada

### Nivel 1 — Pipeline

Los agentes siguen pasos predecibles.

### Nivel 2 — Especialistas

SEO, conversiones, imágenes, seguridad.

### Nivel 3 — Orquestación dinámica

El orquestador decide qué especialistas invocar según categoría, riesgo y plan.

## 9.3 Coding agent

### Operación/desarrollo inicial

**Cline** es excelente para el fundador/equipo: CLI, IDE, SDK, MCP y endpoints OpenAI-compatible; licencia Apache-2.0 en el repositorio principal a fecha de análisis.

### Automatización programática

**OpenHands Software Agent SDK / Agent Server** es mejor candidato para jobs de programación sandboxed y controlados por API. OpenHands está bajo MIT y dispone de arquitectura para servidores/agents; no se debe simplemente exponer una instancia single-user como multi-tenant.

### Regla

No dar acceso directo de un coding agent a producción. El agente trabaja en workspace temporal, produce commit/artifact y entra en CI/QA.

---

# 10. Model Router

## 10.1 Objetivo

Elegir modelo por **calidad necesaria, coste, latencia, privacidad y disponibilidad**, no por marca.

## 10.2 Política inicial sugerida

| Tarea | Primario | Alternativa | Premium/escalación |
|---|---|---|---|
| Clasificación/extracción | modelo económico rápido | Workers AI Qwen/Granite/GLM | Gemini Flash |
| Copy estándar | Qwen/Gemini Flash | modelo Workers AI | premium solo revisión |
| Brand reasoning | Gemini Flash / Qwen fuerte | otro proveedor | modelo premium multimodal |
| Código de sitio | Qwen Coder / Qwen3-Coder disponible | modelo coding vía OpenRouter/provider | premium coding model para fallos |
| Visión QA | Gemini multimodal u otro | provider alterno | premium vision |
| Resumen/reportes | modelo económico | Gemini Flash | — |
| Soporte cliente | modelo económico + RAG | fallback | premium según plan |

## 10.3 Qwen y Kaggle

Qwen2.5-Coder-32B sigue siendo utilizable, pero en 2026 ya puede consumirse directamente en Cloudflare Workers AI con endpoint compatible con OpenAI. Por tanto:

- Kaggle + túnel se conserva para experimentación/modelos no disponibles;
- no se convierte en dependencia productiva;
- modelos Qwen más recientes se evalúan por benchmark interno antes de migrar.

## 10.4 Fallback

Cada `ModelPolicy` define:

`Primary → retry → fallback_same_class → premium_fallback → fail_to_queue`.

Nunca cambiar de modelo silenciosamente si el output puede afectar hechos publicados: la ejecución registra el modelo efectivo.


# 11. Site Factory

## 11.1 Principio

La fábrica no genera “un proyecto nuevo” por cliente. Genera una **instancia de sitio** a partir de una arquitectura compartida.

Un sitio se define como:

```text
Site = BusinessTruth
     + VerticalRecipe
     + BrandProfile
     + ContentModel
     + LayoutVariant
     + FeatureFlags
     + AssetManifest
     + SEOConfig
```

## 11.2 Tecnología de frontend recomendada

Para las webs públicas, **Astro** es un candidato excelente porque prioriza HTML estático/minimal JS y tiene integración oficial con Cloudflare Workers. Para formularios, reservas o widgets se utilizan islands/componentes interactivos.

No se recomienda Next.js como requisito universal para cada web; sería más complejidad de la necesaria para sitios locales mayormente informativos. El portal SaaS sí puede utilizar React/Next.js u otra SPA/full-stack moderna si el equipo lo prefiere.

## 11.3 Vertical Recipes

Las 38 categorías no necesitan 38 motores completamente independientes. Agruparlas inicialmente en arquetipos:

1. Citas médicas/salud.
2. Profesionales y servicios de confianza.
3. Restaurantes/gastronomía.
4. Belleza/bienestar.
5. Educación/formación.
6. Hogar/reparaciones/servicios locales.
7. Automotriz.
8. Retail/showroom.
9. Fitness/deportes.
10. B2B/profesionales corporativos.

Cada receta define:

- objetivo principal;
- CTA primario/secundario;
- módulos recomendados;
- información mínima;
- schema permitido;
- restricciones de claims;
- conversion events;
- tipo de imágenes;
- patrones de layout.

A medida que haya datos, se especializan subverticales.

## 11.4 Design Grammar

Para evitar clones y al mismo tiempo mantener calidad, no permitir que la IA genere CSS arbitrario desde cero para cada negocio.

Crear un **Design Grammar** con:

- 8–12 layout families;
- múltiples heroes;
- grids;
- tipos de navbar;
- sistemas tipográficos;
- escalas de spacing;
- estilos de cards;
- sets de iconos;
- modos de imagen;
- composiciones CTA;
- paletas derivadas de marca;
- radios/sombras limitados;
- motion presets.

La IA selecciona y parametriza dentro del sistema. Resultado: diversidad controlada y QA más fácil.

## 11.5 Materialización

Recomendación:

- PostgreSQL mantiene la configuración canónica;
- un build worker genera un `SiteSnapshot` estático/versionado;
- HTML/CSS/JS y manifest se publican en R2 o storage equivalente;
- el Worker wildcard resuelve el hostname y sirve el snapshot con cache;
- pequeñas funciones dinámicas llaman al API.

Ventajas:

- sitios muy rápidos;
- tráfico público no golpea la DB en cada request;
- rollback instantáneo a snapshot anterior;
- una caída del backend no derriba los sitios ya publicados;
- coste marginal bajo.

## 11.6 Publish Pipeline

```text
Config Draft
  → Validate Schema
  → Render
  → Build
  → Static Checks
  → Browser Tests
  → Visual QA
  → SEO/Accessibility checks
  → Publish Snapshot
  → Purge/Version Cache
  → Health Check
  → ACTIVE
```

El sitio nunca pasa a ACTIVE simplemente porque el build command terminó con exit code 0.

---

# 12. Brand Intelligence

## 12.1 Inputs

- Business Truth;
- categoría;
- nombre;
- ubicación;
- web previa;
- logo si existe;
- fotos verificadas;
- redes;
- tono del propietario;
- objetivo de conversión;
- competidores como inspiración analítica, nunca para copiar activos.

## 12.2 Output estructurado

`BrandProfile`:

```yaml
personality:
  - confiable
  - cercana
visual_direction: editorial-clean
primary_audience: ...
primary_goal: booking
color_tokens: ...
type_scale: ...
layout_family: ...
image_policy: ...
tone_of_voice: ...
cta_style: ...
```

## 12.3 Cuando faltan datos

No completar la realidad con ficción. Separar:

- **facts:** publicados como hechos;
- **editorial framing:** copy que no inventa datos;
- **suggestions:** propuestas no publicadas hasta aprobación;
- **representational visuals:** assets genéricos/generados marcados internamente como representativos.

Ejemplo válido:

> “Conoce los servicios disponibles y consulta directamente por disponibilidad.”

Ejemplo inválido si no existe evidencia:

> “Más de 15 años atendiendo a miles de clientes en Lima.”

## 12.4 Logo inexistente

Para demo puede generarse un **wordmark temporal** tipográfico, marcado en datos como `generated_demo_asset`. Tras claim, el propietario lo acepta, reemplaza o contrata identidad visual.

---

# 13. Business Truth Layer

Este es uno de los componentes más importantes del producto.

## 13.1 Field-level provenance

Cada dato publicable debe poder responder:

- ¿de dónde salió?;
- ¿cuándo se observó?;
- ¿quién lo confirmó?;
- ¿qué derecho tenemos para publicarlo?;
- ¿qué confianza tiene?;
- ¿está desactualizado?;
- ¿es inferido o literal?;

Modelo conceptual:

```text
BusinessFact
- id
- business_id
- field_key
- value
- source_type
- source_reference
- observed_at
- confidence
- owner_verified
- publication_status
- legal_basis_or_right
- superseded_by
```

## 13.2 Jerarquía de fuentes

Orden recomendado:

1. propietario verificado;
2. sitio oficial del negocio y datos expresamente publicables;
3. registros/licencias/fuentes públicas permitidas;
4. proveedores/licencias de datos;
5. redes oficiales;
6. fuentes de terceros permitidas;
7. inferencias — **nunca tratadas automáticamente como hechos**.

## 13.3 Riesgo actual: datos de Google Maps

El proyecto debe realizar una **Data Provenance Remediation** antes de escalar. Los términos actuales de Google Maps Platform prohíben scraping/exportación y rehosting de Google Maps Content, con ejemplos que incluyen guardar nombres, direcciones y reseñas fuera de los servicios autorizados.

Por tanto:

- no asumir que el dataset scrapeado es libre para explotación comercial;
- inventariar qué campos provienen de Google;
- suspender scraping adicional hasta revisión;
- reemplazar/probar los campos mediante fuentes independientes y legítimas;
- mantener registro de procedencia;
- consultar asesoría legal peruana/contractual para el dataset existente.

Esto no significa que el negocio deba descartarse; significa que **la procedencia de datos debe limpiarse antes de convertir el dataset en el moat**.

---

# 14. Data Architecture

## 14.1 Fuente de verdad

**PostgreSQL**.

No usar n8n, GitHub JSON, Google Sheets o KV como fuente canónica.

## 14.2 Esquema de alto nivel

### Identidad y organizaciones

- `users`
- `organizations`
- `organization_members`
- `roles`

### Negocios

- `businesses`
- `business_sources`
- `business_facts`
- `business_categories`
- `locations`
- `contacts`
- `social_profiles`

### Prospecting

- `prospects`
- `qualification_scores`
- `outreach_permissions`
- `contact_attempts`
- `suppression_entries`

### Auditoría

- `audits`
- `audit_findings`
- `audit_artifacts`

### Marca y sitio

- `brand_profiles`
- `sites`
- `site_configs`
- `site_versions`
- `site_snapshots`
- `vertical_recipes`
- `assets`
- `domains`
- `deployments`

### Claim/ownership

- `claims`
- `claim_evidence`
- `ownership_verifications`

### Billing

- `plans`
- `plan_prices`
- `subscriptions`
- `subscription_items`
- `payments`
- `invoices`
- `entitlements`
- `entitlement_grants`

### CRM/growth

- `leads`
- `lead_events`
- `conversions`
- `campaigns`
- `opportunities`
- `experiments`

### Automation/AI

- `jobs`
- `workflow_runs`
- `agent_runs`
- `model_calls`
- `prompts`
- `exceptions`
- `audit_log`

## 14.3 Managed Postgres vs Oracle-hosted DB

Recomendación inicial: **managed PostgreSQL** en vez de operar la DB crítica en una VM gratuita.

Opciones:

- Neon — atractivo por Postgres serverless/scale-to-zero y free tier actual;
- Supabase — alternativa madura con DB + Auth + Storage, aunque aquí no es necesario usar todos sus módulos.

Oracle Free puede alojar runners/n8n, pero no debería ser el único lugar del dato crítico si puede ser reclamado por inactividad y no posee SLA del free tier.

## 14.4 KV/cache

Cloudflare KV es apropiado para datos de lectura rápida que pueden reconstruirse:

`hostname → site_id → active_snapshot_id`

No es la fuente canónica. Si KV falla o queda obsoleto, se reconstruye desde PostgreSQL.

---

# 15. Multi-Tenant Architecture

## 15.1 Tenant model

`Organization` es el tenant comercial.

Una organización puede administrar múltiples negocios:

```text
Organization
 ├── Business A
 │    └── Site A
 ├── Business B
 │    └── Site B
 └── Business C
      └── Site C
```

## 15.2 Aislamiento

Todas las tablas tenant-owned llevan `organization_id` y políticas estrictas de autorización.

Los tokens del usuario nunca deberían determinar directamente el `organization_id` mediante un parámetro confiado del frontend. El servidor resuelve membresía y permisos.

## 15.3 Sitios públicos

Los sitios públicos son tenant data pero se sirven por `site_id/snapshot` y no necesitan exponer la organización.

## 15.4 ¿Workers for Platforms?

No en el MVP.

Utilizar primero:

- un Worker wildcard;
- un renderer/site engine común;
- config/snapshot por sitio.

Migrar a Workers for Platforms cuando exista necesidad real de:

- código ejecutable diferente por tenant;
- aislamiento de ejecución;
- scripting personalizado;
- escala de plataforma que justifique el coste y complejidad.

Cloudflare Workers for Platforms parte actualmente de un coste superior al Worker estándar, por lo que no aporta valor al inicio si todos comparten el mismo engine.

---

# 16. Cloud Architecture

## 16.1 Stack de infraestructura recomendado

### Cloudflare

- DNS;
- CDN;
- TLS;
- WAF/rate controls;
- wildcard routing;
- Workers;
- R2;
- KV para mapping/cache;
- Queues para trabajos/eventos ligeros;
- Turnstile para anti-bot;
- AI Gateway;
- Workers AI;
- Custom Hostnames cuando haya dominios de clientes.

### Oracle Cloud

Uso recomendado durante MVP:

- n8n;
- agent runner;
- OpenHands Agent Server/workspaces;
- jobs largos;
- herramientas de auditoría/browser;
- servicios internos no críticos.

No convertirlo en el único punto de fallo.

### Managed Postgres

Neon/Supabase u otro Postgres administrado.

### GitHub

- monorepo;
- Actions/CI;
- issues;
- releases;
- IaC/scripts;
- source control.

## 16.2 Cloudflare Free vs Paid

El free tier es excelente para validación, pero el negocio debe presupuestar desde temprano al menos Workers Paid si el volumen/uso lo requiere. A fecha del análisis:

- Workers Free: 100.000 requests/día y límites de CPU;
- Workers Paid: mínimo aproximado de US$5/mes e incluye un volumen amplio antes de overage;
- static assets tienen entrega muy favorable;
- Queues Free incluye 10.000 operaciones/día;
- R2 tiene cuota gratuita y sin egress típico de otros clouds;
- Workers AI incluye 10.000 Neurons/día sin cargo antes de requerir Paid para excedentes.

Diseñar sobre pricing público, no sobre la expectativa de “gratis ilimitado”.

---

# 17. Domain Architecture

## 17.1 Demos

Zona wildcard:

`*.guialima.online`

Cloudflare Worker resuelve cualquier hostname de demo válido.

No crear registros DNS individuales si wildcard cubre el caso.

## 17.2 Cliente activo

Flujo:

1. Cliente introduce dominio.
2. Sistema crea `Domain` en estado `PENDING`.
3. API crea Custom Hostname en Cloudflare for SaaS o devuelve instrucciones DNS.
4. Sistema verifica DNS/TLS.
5. Health check.
6. `ACTIVE`.
7. Sitio empieza a responder por dominio propio.
8. Demo se mantiene como preview/noindex o redirige según estrategia.

## 17.3 Coste de custom hostnames

Cloudflare for SaaS actualmente incluye una cantidad inicial de hostnames según plan y cobra por hostnames adicionales en planes self-service; el blueprint debe revalidar precio al lanzar. Este coste debe estar incluido en pricing del cliente, no absorbido accidentalmente.

## 17.4 No comprar dominios automáticamente al principio

Conectar dominios existentes es más sencillo. La compra automática de dominios introduce:

- registrars;
- identidad;
- renovaciones;
- disputas;
- transferencias;
- vencimientos.

Añadir `Domain Registration` como módulo posterior mediante un registrar API cuando haya suficiente volumen.

---

# 18. Storage Architecture

## Código

GitHub.

## Datos estructurados

PostgreSQL.

## Cache/mapping

Cloudflare KV.

## Assets y artifacts

Cloudflare R2:

- logos;
- fotografías;
- imágenes generadas;
- screenshots;
- PDF;
- exportaciones;
- video final si se introduce;
- snapshots de sitio.

R2 es privado por defecto; servir assets públicos mediante custom domain/caching, no usando endpoints de desarrollo.

## Metadata obligatoria por asset

- owner/source;
- usage rights;
- real/generated;
- generated_model si aplica;
- hash;
- width/height;
- MIME;
- alt text;
- business_id;
- created_at;
- expiration/retention si aplica.

---

# 19. Workflow Architecture

## 19.1 Workflows no son lo mismo que agentes

Un workflow define el proceso. Un agente realiza una tarea con incertidumbre.

Ejemplo:

```text
Workflow: GenerateDemo
1 validate_business_truth     deterministic
2 select_recipe              rules + classifier
3 generate_brand_profile     AI
4 generate_copy              AI
5 select_assets              rules/AI
6 render_site                deterministic
7 qa                         deterministic + AI reviewer
8 publish                    deterministic
9 notify                     workflow
```

## 19.2 Idempotency

Todo paso que cause efectos externos necesita `idempotency_key`.

Ejemplos:

- cobrar;
- enviar email;
- crear hostname;
- publicar snapshot;
- crear repo/release;
- enviar mensaje.

Retries nunca deben duplicar pagos, dominios o envíos.

---

# 20. n8n Strategy

## Sí usar n8n para

- recibir webhooks secundarios;
- email workflows;
- sincronización CRM;
- notificaciones internas;
- schedules no críticos;
- conectar SaaS de terceros;
- prototipar integraciones;
- campañas consentidas;
- reporting auxiliar.

## No usar n8n para

- autorización;
- cálculo de entitlements;
- fuente de verdad de subscriptions;
- state machine principal;
- ownership verification crítica;
- transacciones que exijan consistencia;
- lógica de seguridad.

## Licencia

La Community Edition puede utilizarse internamente para operaciones propias. Si en el futuro se pretende exponer/white-label n8n como parte del producto que usan clientes, revisar la licencia vigente/comercial antes de hacerlo.

---

# 21. Queue Architecture

## 21.1 Tipos de colas

- `audit_jobs`
- `research_jobs`
- `brand_jobs`
- `site_build_jobs`
- `visual_qa_jobs`
- `publish_jobs`
- `domain_jobs`
- `email_jobs`
- `report_jobs`
- `agent_jobs`

## 21.2 Cloudflare Queues

Es una excelente primera opción para eventos/trabajos cortos y desacoplar el edge. Actualmente dispone de Free tier, retries/delays y dead-letter queues, y puede entregar a HTTP pull consumers.

## 21.3 Durable workflows — Trigger.dev recomendado

Para trabajos de IA que duran minutos, esperan aprobaciones o encadenan varios pasos, **Trigger.dev** reduce mucho código propio. A fecha del análisis ofrece tareas sin timeout, retries, schedules, versionado, observabilidad, human-in-the-loop, un free tier con créditos y 20 ejecuciones concurrentes, y puede self-hostearse bajo Apache-2.0.

Arquitectura recomendada:

```text
Cloudflare Queue / Domain Event
  → Trigger.dev durable task
      → AI/model calls
      → OpenHands/agent runner si requiere sandbox
      → wait/approval/retry
      → persist result
  → Domain Event
```

**n8n no sustituye esta capa**: n8n queda para conectores e integraciones; Trigger.dev para workflows largos escritos en código; Cloudflare Queues para buffering/eventos ligeros.

**Alternativa:** Inngest, cuyo free tier actual incluye 50k executions/mes pero menor concurrencia gratuita. Temporal es técnicamente excelente, pero introduce una complejidad innecesaria para el MVP.

## 21.4 Jobs largos / coding agents

Un coding agent puede tardar varios minutos o más. No mantener un HTTP request abierto. Cuando requiere Docker, navegador pesado o workspace de código, Trigger.dev coordina y el trabajo se ejecuta en un Agent Runner aislado.

Flujo:

```text
Durable task
  → Agent Runner on Oracle/container
  → heartbeat/status
  → artifact/commit
  → QA
  → event
```

## 21.5 Job state

`PENDING → LEASED → RUNNING → SUCCEEDED | RETRY | DEAD | HUMAN_REVIEW`

Guardar:

- attempts;
- timeout;
- trace_id;
- input hash;
- output artifact;
- cost;
- logs.

---

# 22. Event Architecture

Eventos de dominio recomendados:

```text
BusinessCreated
BusinessTruthUpdated
ProspectQualified
AuditCompleted
DemoBuildRequested
DemoBuilt
QaPassed
QaFailed
DemoPublished
ClaimSubmitted
ClaimVerified
CheckoutStarted
PaymentSucceeded
PaymentFailed
SubscriptionActivated
SubscriptionPastDue
EntitlementGranted
EntitlementRevoked
OnboardingCompleted
DomainVerificationRequested
DomainActivated
SitePublished
LeadCaptured
ConversionConfirmed
ExperimentCompleted
SubscriptionCancelled
SiteSuspended
```

## Outbox pattern

Para eventos críticos: actualizar DB + registrar `outbox_event` en la misma transacción; un publisher los entrega después. Evita que DB diga PAID pero el webhook interno se pierda.

---

# 23. Billing Architecture

## 23.1 Adapter

Crear interfaz:

```text
BillingProvider
- createCheckout()
- createSubscription()
- cancelSubscription()
- pauseSubscription()
- getSubscription()
- verifyWebhook()
- refund()
```

## 23.2 Perú

Si el proveedor que el usuario ya utiliza soporta suscripciones + webhooks + API, mantenerlo.

Si no:

### Mercado Pago

Ventajas:

- subscriptions/planes;
- lifecycle/retries;
- presencia local;
- múltiples medios de pago, incluidos métodos locales disponibles según producto.

### Culqi

Ventajas:

- proveedor peruano;
- APIs de planes/suscripciones;
- PEN/USD;
- webhooks;
- pagos recurrentes.

Realizar prueba comercial/fees/support antes de seleccionar.

## 23.3 Lifecycle

```text
TRIAL/DEMO
 → CHECKOUT_PENDING
 → ACTIVE
 → PAST_DUE
 → GRACE_PERIOD
 → SUSPENDED
 → CANCELLED
```

Un fallo de pago no borra el sitio. Aplicar grace period y dunning.

## 23.4 Facturación tributaria

Separar payment processing de comprobante tributario. Diseñar `InvoiceProvider` independiente para integrar el mecanismo de comprobantes electrónicos requerido en Perú/SUNAT cuando se formalice el flujo. Validar con contador/asesor local.

---

# 24. Entitlement Architecture

Los planes no deben aparecer como `if plan === 'pro'` dispersos por todo el código.

Modelo:

```text
Feature
Plan
PlanFeature
Subscription
EntitlementGrant
```

Ejemplos de feature keys:

- `site.custom_domain`
- `site.max_pages`
- `analytics.basic`
- `analytics.advanced`
- `seo.basic`
- `seo.advanced`
- `agent.web_chat`
- `agent.whatsapp`
- `automation.lead_followup`
- `content.monthly_posts`
- `support.priority`

El sistema consulta entitlements y el UI se adapta.

Add-ons crean grants sin obligar a crear un plan nuevo.

---

# 25. Claim System

## 25.1 Objetivo

Permitir que un propietario legítimo tome control sin permitir secuestro de fichas.

## 25.2 Flujo

1. `Reclamar sitio`.
2. Captura de identidad/cuenta.
3. Selección del vínculo con el negocio.
4. Método de verificación.
5. Evidencia.
6. Auto-approve si el método tiene alta confianza.
7. Review si es ambiguo.
8. Crear `organization/business ownership`.
9. Ofrecer checkout/onboarding.

## 25.3 Métodos de verificación posibles

- email bajo dominio oficial;
- código enviado a canal ya verificado del negocio, cuando legalmente permitido;
- DNS TXT para quien controla dominio;
- documento/registro comercial mediante revisión;
- llamada/verificación humana para casos conflictivos.

No depender de reclamar Google Business Profile y nunca modificarlo sin consentimiento expreso.

## 25.4 Disputas

Debe existir:

- audit log;
- freeze temporal;
- revocación;
- escalamiento humano;
- historial de ownership.


# 26. Customer SaaS Portal

## 26.1 Objetivo

Autoservicio suficiente para eliminar la mayor parte del trabajo operativo repetitivo.

## 26.2 Navegación recomendada

- Inicio / Salud digital
- Mi negocio
- Mi sitio
- Contenido
- Servicios
- Horarios
- Redes y contacto
- Fotos y marca
- Dominio
- Leads
- Analytics
- SEO
- Automatizaciones
- Agentes IA
- Plan y facturación
- Soporte

## 26.3 Editor

No construir page builder libre tipo Elementor en la fase inicial.

Ofrecer:

- formularios estructurados;
- reorder de secciones permitido;
- toggle de módulos;
- selección de algunas variantes visuales;
- preview;
- publish.

Esto reduce errores, soporte y páginas visualmente rotas.

## 26.4 Natural Language Operations

Fase posterior útil:

> “Cambia el horario del sábado a 9 a 2.”

El agente produce un **proposed patch**:

```diff
Saturday: 09:00-18:00
+ Saturday: 09:00-14:00
```

El cliente confirma. Solo entonces se persiste y publica.

## 26.5 Tutoriales

Videos muy cortos y contextuales en lugar de un curso largo:

- cambiar WhatsApp;
- agregar fotos;
- conectar dominio;
- revisar leads;
- activar un módulo.

La UX debe ser suficientemente clara para que el video sea opcional.

---

# 27. Analytics

## 27.1 Dos analíticas diferentes

### Platform Analytics

Para HazloCrecer:

- funnel de adquisición;
- demo views;
- claim starts;
- checkout;
- conversion;
- churn;
- activation;
- feature adoption.

### Customer Analytics

Para cada negocio:

- visitas;
- CTA click;
- phone click;
- WhatsApp click;
- form submit;
- booking;
- lead;
- conversion confirmada.

## 27.2 PostHog

Primera opción recomendada para producto/funnels/experimentos. A fecha del análisis ofrece un free tier de 1 millón de eventos de product analytics al mes y capacidades de feature flags/experiments/session replay con sus propias cuotas.

No necesariamente enviar todos los pageviews de miles de demos a PostHog. Aplicar sampling/Cloudflare Web Analytics para tráfico bruto y PostHog para eventos de producto de alto valor.

## 27.3 Attribution model

Diferenciar estrictamente:

- `page_view`;
- `intent_event`;
- `lead`;
- `qualified_lead`;
- `customer_reported_conversion`;
- `verified_conversion`.

Nunca decir al negocio “te conseguimos 37 clientes” cuando solo existen 37 clicks a WhatsApp.

## 27.4 Privacy

Minimizar PII. Asignar identificadores pseudónimos. Definir retención. No guardar conversaciones completas si basta con eventos agregados.

---

# 28. CRM

## 28.1 Recomendación: híbrido

No construir HubSpot desde cero.

Construir en la plataforma solo las entidades estratégicas:

- prospect;
- business;
- demo;
- claim;
- customer;
- subscription;
- opportunity;
- lead origin;
- activity timeline.

Para funciones commodity avanzadas de ventas, evaluar integración con un CRM externo cuando aparezca equipo comercial.

## 28.2 Pipeline inicial

```text
DISCOVERED
 → QUALIFIED
 → AUDITED
 → DEMO_READY
 → CONTACT_ALLOWED
 → CONTACTED
 → ENGAGED
 → CLAIM_STARTED
 → CHECKOUT
 → WON | LOST | NURTURE
```

## 28.3 Lead scoring comercial

Score sugerido:

- sitio inexistente o deficiente;
- volumen/calidad de reputación proveniente de fuente legítima;
- facilidad de contacto;
- vertical economics;
- señales de actividad;
- potencial de conversión;
- calidad de datos;
- disponibilidad de assets;
- engagement con demo.

El score no debe usar atributos sensibles ni discriminatorios.

---

# 29. SEO / GEO / AEO

## 29.1 Decisión crítica: demos noindex

Las demos de venta en GuiaLima deben salir con:

```html
<meta name="robots" content="noindex,follow">
```

por defecto, y quedar fuera del sitemap público indexable.

Razones:

- evitar scaled content abuse;
- evitar doorways;
- no competir con el sitio oficial;
- evitar indexar datos no verificados;
- reducir confusión sobre oficialidad.

Google documenta que la generación de muchas páginas principalmente para manipular rankings y sin valor genuino puede considerarse scaled content abuse; también penaliza patrones doorway.

## 29.2 Qué sí indexar

### TodoLima

Páginas de directorio/categoría/ficha que:

- tengan datos con procedencia permitida;
- aporten descubrimiento real;
- no sean duplicados;
- ofrezcan utilidad independiente.

### Cliente verificado

El sitio oficial reclamado puede indexarse cuando:

- datos confirmados;
- contenido suficiente;
- dominio final;
- schema correcto;
- canonical correcto;
- QA aprobado.

## 29.3 Al activar dominio

- custom domain se vuelve canonical;
- demo permanece `noindex`;
- opcionalmente 301 al dominio final cuando ya no sea necesaria como preview.

## 29.4 SEO local

Aplicar:

- títulos y descriptions reales;
- LocalBusiness subtype cuando corresponda;
- dirección/horarios solo si confirmados;
- service pages útiles;
- internal linking;
- sitemap;
- robots;
- image alt;
- performance;
- accessibility;
- schema validation.

## 29.5 GEO/AEO

No tratarlo como truco separado. Principios:

- entidades claras;
- hechos verificables;
- estructura semántica;
- FAQs auténticas;
- fuentes/citas donde corresponda;
- información local precisa;
- contenido que responda preguntas reales.

---

# 30. Sales Engine

## 30.1 No generar full demo para todos

Crear tres tiers:

### Tier A — Full Demo

Prospectos con alto score.

Entrega:

- auditoría;
- demo completa;
- screenshot;
- mensaje personalizado;
- claim link.

### Tier B — Audit + Preview

- auditoría;
- hero/preview visual;
- full demo se genera al detectar engagement.

### Tier C — Directory Only

Mantener ficha y volver a evaluar más adelante.

Esto mejora unit economics.

## 30.2 Canales

Prioridad:

1. inbound/claim;
2. email legítimo y contextual;
3. contacto inicial permitido conforme regulación;
4. llamadas selectivas de alto valor;
5. WhatsApp solo bajo consentimiento/opt-in y políticas de Meta;
6. retargeting/ads una vez exista suficiente señal.

## 30.3 WhatsApp

La política de WhatsApp Business exige que el usuario haya entregado su número y optado por recibir mensajes; mensajes iniciados por la empresa requieren plantillas aprobadas fuera de la ventana aplicable. Por tanto, **no convertir teléfonos scrapeados en una campaña automática de WhatsApp**.

## 30.4 Demo como prueba de valor

El mensaje comercial debe evitar presión y falsas afirmaciones.

Concepto:

> “Preparamos una demostración basada en información disponible/confirmada para mostrar una posible mejora. No es el sitio oficial. Si eres el propietario puedes revisarla y reclamarla.”

---

# 31. Marketing Engine

El marketing a clientes activos es un producto posterior, no requisito del MVP.

## Capacidades futuras

- content calendar;
- blog drafts;
- social assets;
- campaign landing pages;
- email nurture;
- SEO opportunities;
- ad creative drafts;
- reputation workflows;
- lead follow-up.

## Regla

Toda automatización de marketing necesita:

- objective;
- audience;
- approved channel;
- budget;
- attribution;
- stop condition.

No medir éxito por publicaciones producidas. Medir leads/conversiones/coste.

---

# 32. Growth Engine

## 32.1 Objetivo

Convertir telemetría agregada en recomendaciones y, posteriormente, experiments.

Ejemplo:

```text
Dentistas + hero variante B
→ +18% booking_click
→ suficiente muestra
→ proponer variante B como default del recipe
```

## 32.2 Tres niveles

### Insights

La IA describe oportunidades, sin aplicar cambios.

### Assisted Optimization

Genera propuesta; humano/cliente aprueba.

### Auto Optimization

Solo para cambios de bajo riesgo, con experimentación y rollback automático.

## 32.3 No contaminar datos

La mejora por vertical necesita muestras suficientes. No convertir correlaciones pequeñas en reglas.

---

# 33. Security

## 33.1 Auth

Usar solución probada en lugar de crear autenticación desde cero. Opciones:

- Better Auth como librería controlada por la plataforma;
- Supabase Auth;
- proveedor externo según necesidades.

MFA para admins y acciones sensibles.

## 33.2 RBAC

Roles mínimos:

- owner;
- admin;
- editor;
- viewer;
- billing;
- support_internal;
- platform_admin.

## 33.3 Tenant isolation

Tests automatizados deben verificar que un usuario de Organization A no puede leer/modificar B.

## 33.4 Agent security

Coding agents:

- containers/workspaces efímeros;
- sin secretos de producción;
- tool allowlist;
- network restrictions cuando sea posible;
- resource limits;
- no `sudo` en host;
- secret scanning;
- approval gates;
- artifact-only output.

## 33.5 Prompt injection

Contenido web investigado es **untrusted data**. Nunca concatenarlo con privilegios de herramienta sin delimitación/policies.

Los agentes de research no reciben credenciales de deploy.

Los agentes de deploy no interpretan libremente contenido externo.

## 33.6 Secret management

No secrets en repositorio, prompts, logs o R2 público.

Utilizar secret store de plataforma/Cloudflare/runner.

## 33.7 Anti-bot

Turnstile es apropiado para:

- claim;
- signup;
- forms expuestos;
- password recovery sensible;
- abuse-prone endpoints.

Cloudflare ofrece Turnstile Free con challenges ilimitados dentro de las restricciones del plan.

---

# 34. Observability

## 34.1 Tres capas

### Infra

- request errors;
- latency;
- Worker CPU;
- queue backlog;
- R2 errors;
- DB connections.

### Product

- signup;
- claim;
- checkout;
- activation;
- feature usage.

### AI

- model;
- tokens;
- cost;
- latency;
- fallback;
- schema failures;
- human rejection;
- prompt version.

## 34.2 Exception Dashboard

Vista diaria:

```text
SYSTEM HEALTH
Sites checked: 4,821
Healthy:       4,785
Warning:          24
Blocked:          12

Jobs
Succeeded:     1,204
Retrying:         17
Dead:              3
Human review:      9
```

## 34.3 Alertas

Alertar solo lo accionable:

- payment webhook verification failures;
- queue DLQ growth;
- domain/TLS failure;
- elevated 5xx;
- site health regression;
- unusual AI spend;
- unauthorized access pattern.

---

# 35. Human-in-the-loop

## Automático

- copy sobre facts claros;
- render;
- builds;
- deterministic QA;
- publishing después de gates;
- pago/subscription lifecycle;
- dominio cuando verificable;
- reporting.

## Revisión

- baja confianza de datos;
- contenido médico/legal delicado;
- imagen dudosa;
- ownership ambiguo;
- visual QA borderline;
- cambios grandes de marca.

## Bloqueado

- disputa de propiedad;
- payment fraud signal;
- publicación sin datos mínimos;
- security failure;
- datos sin derecho claro de uso;
- claim conflictivo.

## Contratación futura

Contratar personas para:

- operaciones de excepciones;
- customer success;
- ventas high-touch;
- diseño premium;
- soporte;
- compliance.

No contratar un ejército para cambiar teléfonos y links.

---

# 36. Cost Architecture

## 36.1 Cost drivers

- model tokens;
- imágenes;
- video;
- storage;
- Worker requests/CPU;
- database;
- analytics events;
- email;
- WhatsApp/BSP;
- custom hostnames;
- agent compute;
- support humano;
- payment fees;
- domains.

## 36.2 Cost tags

Cada job debe registrar:

- `business_id`;
- `customer_id` si existe;
- `workflow`;
- `provider`;
- `model`;
- `estimated_cost_usd`;
- `billable_feature`.

Sin esto no se pueden calcular unit economics reales.

## 36.3 AI cost ejemplo

El precio actual de Workers AI para Qwen2.5-Coder-32B es aproximadamente US$0,66/M input tokens y US$1/M output tokens. Un job de código con 50k input + 20k output tendría una inferencia teórica de unos US$0,053 antes de loops adicionales. Otros modelos son mucho más baratos o más caros.

Por tanto, **el coste de la IA no será necesariamente el problema**; loops descontrolados, imágenes premium, video, soporte y adquisición pueden costar más.

## 36.4 Presupuesto orientativo, no cotización

### MVP — 100 demos / 20 clientes

- infra base: ~US$0–25/mes usando free tiers legítimos;
- AI: ~US$5–50 según profundidad;
- pagos: comisión por transacción;
- dominios/WhatsApp no incluidos.

### Early scale — 1.000 demos / 100 clientes

- infra: ~US$25–150/mes;
- AI/generación: ~US$20–300;
- email/analytics pueden continuar parcialmente free;
- custom hostnames alrededor del umbral incluido según plan de Cloudflare.

### Scale — 10.000 demos / 1.000 clientes

- custom hostnames adicionales pueden sumar del orden de decenas/centenas USD/mes;
- DB/analytics/email pasan probablemente a paid;
- AI puede ir de cientos a algunos miles según calidad y frecuencia;
- infraestructura pública sigue teniendo coste bajo comparado con una arquitectura de servidores por cliente.

**Estas cifras son escenarios de planificación. Recalcular con precios vigentes y telemetría real antes de cada fase.**

---

# 37. Free-Tier Strategy

## Objetivo

Free tiers para validar, no para sostener artificialmente una compañía madura.

## Stack MVP legítimo posible

- Cloudflare Workers Free;
- R2 free allocation;
- Queues Free;
- Workers AI daily allocation;
- managed Postgres free tier;
- Oracle Always Free para runner;
- PostHog free;
- Resend free;
- GitHub free/private según límites aplicables.

## Prohibición interna

No crear cuentas duplicadas, rotar organizaciones o repartir requests para evadir límites. Proveedores como Groq prohíben expresamente orquestar múltiples cuentas/organizaciones para superar parámetros publicados.

## Graduation triggers

Pagar cuando:

- el coste sea <5–10% del valor económico protegido/generado;
- free tier limite fiabilidad;
- SLA sea relevante;
- observabilidad/backup lo requiera;
- exista riesgo de suspensión.

---

# 38. Scaling Strategy

## 38.1 Escala por etapas

### 1 negocio

Demostrar ciclo completo.

### 10

Encontrar errores de diversidad y QA.

### 100

Validar queue/state machine/observability.

### 1.000

Validar unit economics, claims y soporte.

### 10.000+

Optimizar cache, partitions, analytics, batch generation y ops.

## 38.2 No escalar generación antes de ventas

Gate sugerido antes de pasar de 100 a 1.000 demos:

- demo pass rate >95% sin edición manual;
- coste por demo conocido;
- al menos señales repetibles de claim/engagement;
- compliance workflow establecido;
- tiempo humano/demo <5 min promedio;
- incidentes críticos cerca de cero.

---

# 39. Technology Decision Matrix

| Capa | Recomendación | Alternativa | Cuándo cambiar |
|---|---|---|---|
| Public edge | Cloudflare Workers | Vercel/Netlify/custom | si pricing/lock-in deja de ser favorable |
| Site framework | Astro | Next.js/static React | si apps requieren SSR pesado por tenant |
| Assets | Cloudflare R2 | S3/Supabase Storage | por features/compliance/región |
| Source of truth | PostgreSQL | — | mantener SQL portable |
| Managed DB | Neon | Supabase/Postgres provider | SLA/región/precio |
| Cache mapping | Cloudflare KV | Redis | si consistency/latency pattern cambia |
| Edge/event queue | Cloudflare Queues | QStash/Redis | si routing/retención exige otra solución |
| Durable background workflows | Trigger.dev | Inngest / self-hosted engine | si coste, compliance o escala exige migración |
| Workflow integration | n8n self-hosted | Make/custom | si connectors/licensing cambian |
| Agent runner | OpenHands SDK/Agent Server | custom/Cline SDK | si seguridad/throughput exige motor propio |
| Human coding | Cline | Qwen Code/Codex/etc. | preferencia/evaluación |
| AI gateway | Cloudflare AI Gateway | OpenRouter/custom gateway | routing/cost/data residency |
| Cheap models | Workers AI + Gemini tiers | Groq/OpenRouter | benchmarks/coste |
| Auth | Better Auth / managed auth | Supabase Auth/Clerk | compliance/enterprise SSO |
| Product analytics | PostHog | Plausible/Umami | coste/privacy |
| Email transactional | Resend | SES/Postmark | volumen/coste/deliverability |
| Billing Peru | provider actual si apto; MP/Culqi | Izipay/otros | fees/métodos/expansión |
| DNS/custom domains | Cloudflare for SaaS | alternative CDN | lock-in/cost |
| Internal compute | Oracle Free → paid/other | Hetzner/Fly/containers | SLA/capacidad |

---

# 40. Build vs Buy Matrix

| Componente | Decisión | Motivo |
|---|---|---|
| Directory business logic | BUILD | activo/diferenciador |
| Business Truth/provenance | BUILD | moat + compliance |
| Qualification | BUILD | diferencia comercial |
| Site engine | BUILD sobre framework | núcleo del producto |
| Component library | BUILD | calidad/diferenciación |
| Auth crypto/protocol | INTEGRATE | commodity de alto riesgo |
| Payment processor | BUY/INTEGRATE | regulado/commodity |
| Email transport | BUY | deliverability |
| CDN/DNS/TLS | BUY | no reinventar |
| Object storage | BUY | commodity |
| Coding agent | OPEN SOURCE/INTEGRATE | Cline/OpenHands ya resuelven gran parte |
| n8n | OPEN SOURCE internal | integración rápida |
| Analytics | BUY/OPEN SOURCE | no core al inicio |
| CRM completo | INTEGRATE later | no construir HubSpot |
| Growth intelligence | BUILD | potencial moat |
| Vertical recipes | BUILD | conocimiento acumulado |
| Prompt/eval registry | BUILD lightweight | control de calidad IA |

---

# 41. Risk Matrix

| Riesgo | Prob. | Impacto | Mitigación |
|---|---:|---:|---|
| Dataset Google sin derechos claros | Alta | Crítico | provenance remediation antes de escala |
| Demos genéricas / penalización SEO | Alta | Alta | noindex + quality gates |
| Páginas con información inventada | Media | Alta | Business Truth + schema validation |
| Claim fraudulento | Media | Alta | verification + dispute flow |
| Spam/outreach ilegal | Media | Crítico | consent/source registry + suppression |
| WhatsApp policy violation | Alta si mal diseñado | Alta | opt-in; no cold WA automation |
| Free tier suspendido/reducido | Alta | Media | provider abstraction + budget paid |
| Oracle free reclaimed | Media | Media | no DB crítica; runner stateless |
| AI agent ejecuta código peligroso | Media | Crítico | sandbox + no prod secrets |
| Diseño repetitivo | Alta | Media | recipes + design grammar + visual eval |
| Cost runaway | Media | Alta | quotas + cost per job + kill switches |
| Tenant data leak | Baja/Media | Crítico | RBAC/RLS/tests/audits |
| Customer support overwhelms | Media | Alta | self-service + exception operations |
| Vendor lock-in Cloudflare | Media | Media | clean interfaces + portable DB/artifacts |
| Conversion baja | Alta | Crítico | tiered generation + experiments antes de scale |

---

# 42. Red-Team Analysis — por qué podría fracasar

## 42.1 “Construir webs es commodity”

Un competidor puede generar una landing barata.

**Mitigación:** el producto no es HTML. Es distribución + datos + claim + analytics + growth + vertical intelligence.

## 42.2 “Nadie reclama las demos”

Posible si la demo no demuestra valor o la oferta genera desconfianza.

**Mitigación:** testear 20–50 prospectos manualmente antes de producción masiva. Experimentar mensaje, auditoría, precio y diseño.

## 42.3 “Los datos son el activo, pero no podemos usarlos”

Este es el riesgo más serio del estado actual.

**Mitigación:** remediar procedencia, enriquecer desde fuentes propias/propietarios/licenciadas y construir un Business Graph legítimo.

## 42.4 “SEO masivo no funciona o genera penalizaciones”

**Mitigación:** las demos no son estrategia SEO; son sales enablement. TodoLima indexa utilidad genuina. Sitios verificados construyen SEO propio.

## 42.5 “IA produce sitios mediocres”

**Mitigación:** design system y templates de alta calidad, IA parametriza; no pedir “haz cualquier web”. QA visual y vertical recipes.

## 42.6 “La personalización consume demasiado soporte”

**Mitigación:** límites claros por plan, structured editor, premium customization como servicio aparte.

## 42.7 “El cliente cancela después de un mes”

**Mitigación:** mostrar analytics, leads, uptime, actualizaciones y activar productos vinculados a resultados.

## 42.8 “La infraestructura gratuita cambia”

**Mitigación:** unit economics que funcionan también pagando. Free tier es acelerador, no modelo de negocio.

## 42.9 “Los agentes generan regresiones”

**Mitigación:** no auto-merge a producción; CI, snapshot, canary/preview y rollback.

---

# 43. Compliance Considerations

> Este capítulo identifica riesgos operativos y no sustituye asesoría legal profesional.

## 43.1 Protección de datos — Perú

La regulación peruana vigente de protección de datos y su reglamento actualizado exige especial cuidado con prospección comercial y consentimiento. La regulación contempla un primer contacto en determinadas condiciones para solicitar consentimiento, pero no debe interpretarse como autorización para campañas indiscriminadas; se debe poder informar la fuente y respetar oposición/supresión.

Implementar:

- `data_source` por contacto;
- `consent_status`;
- `consent_timestamp`;
- `contact_purpose`;
- `opt_out_at`;
- `suppression_list`;
- auditoría de comunicaciones;
- política de retención.

Consultar asesor peruano antes de automatizar outreach a gran escala.

## 43.2 Google Maps / Business Profile

- no scraping/rehosting de Maps content como base de producto sin derecho;
- no reclamar ni administrar perfiles de negocio sin consentimiento;
- no insinuar relación con Google;
- separar datos propios de datos de terceros.

## 43.3 WhatsApp

- opt-in explícito;
- templates aprobadas cuando corresponde;
- opt-out fácil;
- escalamiento humano en automatizaciones;
- no impersonar al negocio.

## 43.4 Demo transparency

Toda demo no reclamada debe comunicar claramente:

- que no es el sitio oficial;
- quién la creó;
- cómo reclamar/corregir/eliminar;
- cómo contactar por datos incorrectos.

## 43.5 Images/copyright

No reutilizar fotos encontradas en la web por defecto. Mantener licencia/provenance de cada asset.

## 43.6 Takedown

Crear un flujo rápido:

`Request removal → identity/risk check → unpublish/noindex → investigate → resolve`.

No convertir cada retiro en un proceso manual de días.


# 44. Competitive Advantages

## 44.1 Distribución existente

TodoLima aporta algo que un nuevo constructor de webs no tiene: un punto de descubrimiento y un catálogo inicial de mercado local.

## 44.2 Vertical intelligence

La plataforma puede aprender que una clínica dental necesita un funnel distinto a un restaurante. Esa inteligencia se codifica en recipes, métricas y experimentos.

## 44.3 Time-to-value

La demo existe antes de que el prospecto compre. Reduce el salto entre promesa y prueba.

## 44.4 Self-service activation

El cliente no entra a una cola de producción: activa algo que ya existe y lo convierte en su propiedad operativa.

## 44.5 Data loop

La plataforma puede observar qué estructuras generan:

- más claims;
- más clicks;
- más leads;
- menor churn.

Ese dataset de rendimiento, correctamente anonimizado/agregado, mejora el producto.

---

# 45. Moat Strategy

La IA por sí sola no es un moat. Cualquier competidor puede acceder a modelos similares.

## Moats potenciales, en orden

1. **Business Graph legítimo y actualizado de Lima/Perú.**
2. **Distribución orgánica y marca TodoLima.**
3. **Conversion dataset por vertical.**
4. **Vertical recipes optimizadas con evidencia.**
5. **Automated activation + billing + domain + growth stack.**
6. **Customer switching cost sano:** historial, leads, analytics, automations y contenido gestionado.
7. **Operational excellence:** producir/operar miles de sitios con pocos humanos.

## Lo que no es moat

- usar Qwen;
- usar n8n;
- usar Cloudflare;
- tener 20 agentes con nombres distintos;
- generar imágenes con IA.

---

# 46. Continuous Learning System

## 46.1 Experiment registry

Cada experimento define:

- hypothesis;
- vertical;
- metric;
- control;
- variant;
- minimum sample;
- stop criteria;
- result;
- confidence.

## 46.2 Signals

Separar:

- design signals;
- sales signals;
- customer success signals;
- SEO signals;
- lead/conversion signals.

## 46.3 Feedback a recipes

Un experimento ganador **no modifica inmediatamente todos los sitios**.

1. aprobar resultado;
2. crear nueva recipe version;
3. rollout progresivo;
4. monitorizar regresión;
5. ampliar.

## 46.4 Evaluaciones de IA

Crear golden sets por vertical:

- 20–50 negocios reales con truth data;
- outputs esperados/criterios;
- detectar hallucination;
- calidad de copy;
- cumplimiento de schema;
- diseño.

Antes de cambiar un modelo o prompt importante, ejecutar evals.

---

# 47. MVP

## Objetivo del MVP

No es “tener plataforma completa”. Es demostrar:

> Podemos transformar un negocio legítimamente documentado en una demo profesional, publicarla, permitir claim, cobrar, activar y conectar dominio sin editar código manualmente.

## Alcance MVP recomendado

### Incluye

- 1 vertical inicial;
- 10 negocios con datos remediados;
- Business Truth;
- Qualification básico;
- 2–3 layout families;
- Site Engine;
- wildcard GuiaLima;
- QA básico;
- claim;
- auth;
- un plan;
- un payment provider;
- onboarding;
- custom domain;
- analytics esencial;
- admin exception queue.

### No incluye

- marketing agents completos;
- WhatsApp agent;
- 38 categorías;
- CRM avanzado;
- video automático;
- page builder libre;
- cientos de templates;
- Workers for Platforms;
- Kubernetes;
- dominio registry automation;
- multi-region database.

## Criterio de éxito MVP

Ejecutar 10 ciclos end-to-end y que al menos 8 puedan pasar de Business Truth a demo publicada sin editar código manualmente. Completar al menos un flujo real de claim → pago/test payment → onboarding → dominio.

---

# 48. Phase-by-phase Roadmap

## Phase 0 — Legitimidad, arquitectura y datos

**Duración operativa:** antes de automatización masiva.  
**Objetivo:** quitar los riesgos que podrían invalidar el proyecto.

### Entregables

- inventario del dataset;
- source/provenance matrix;
- políticas de publicación;
- ToS/legal review de fuentes;
- category economics score;
- arquitectura final de MVP;
- monorepo;
- DB schema inicial;
- ADRs.

### Gate

No iniciar generación masiva mientras no exista criterio documentado de qué datos pueden publicarse.

---

## Phase 1 — Golden Path de una sola web

**Objetivo:** un negocio de principio a fin.

### Construir

- Business Truth editor;
- Brand Profile;
- Site Spec;
- Astro component library;
- build;
- R2 snapshot;
- wildcard Worker;
- `noindex` demo;
- basic QA.

### Gate

Una persona puede añadir business data y producir demo sin tocar código.

---

## Phase 2 — Factory de 10 negocios

**Objetivo:** probar diversidad.

### Construir

- vertical recipe v1;
- 3 layout families;
- job queue;
- agent/model logging;
- Playwright multi-device QA;
- screenshots;
- exception dashboard simple.

### Gate

80%+ de demos publicables sin edición manual profunda.

---

## Phase 3 — 100 negocios + prospect scoring

**Objetivo:** validar economía y adquisición.

### Construir

- Qualification Engine;
- Tier A/B/C;
- audit pipeline;
- email transactional/outreach governance;
- PostHog funnel;
- consent/source ledger.

### Gate

Conocer coste por demo, minutos humanos/demo y señales de engagement.

---

## Phase 4 — Claim + Billing

**Objetivo:** monetización automática.

### Construir

- auth/orgs;
- claim flow;
- verification methods;
- billing adapter;
- Mercado Pago/Culqi/provider actual;
- subscription states;
- entitlements;
- webhook idempotency.

### Gate

Un owner verificado puede pagar y convertirse en cliente sin intervención manual en flujo normal.

---

## Phase 5 — Customer Portal + Custom Domain

**Objetivo:** eliminar cuello de botella postventa.

### Construir

- structured editor;
- versioning;
- preview/publish;
- domain workflow;
- Cloudflare custom hostnames;
- onboarding;
- plan management;
- dunning básico.

### Gate

Cliente cambia teléfono/redes/horarios y publica sin soporte humano.

---

## Phase 6 — Multi-vertical expansion

**Objetivo:** ampliar 1 → 5–10 arquetipos.

### Construir

- recipes;
- content policies;
- vertical QA;
- category-specific CTA;
- recipe analytics.

### Gate

Calidad consistente en múltiples categorías.

---

## Phase 7 — AI Agents as Product

**Objetivo:** recurrencia de mayor valor.

### Añadir

- site assistant;
- knowledge base;
- lead qualification;
- booking integration;
- WhatsApp solo con infraestructura/opt-in correctos;
- human handoff.

### Gate

Medir tiempo ahorrado/leads gestionados, no conversaciones generadas.

---

## Phase 8 — Growth Platform

**Objetivo:** optimización continua.

- experiments;
- SEO opportunities;
- campaigns;
- content;
- conversion suggestions;
- automatic low-risk optimizations.

---

## Phase 9 — Regional scaling

Solo después de demostrar Lima.

- más ciudades;
- nuevas fuentes legítimas de datos;
- localized compliance;
- payment adapters por país;
- locale/currency/tax abstractions.

---

# 49. KPIs

## North Star

**Activated businesses generating attributable business intent/results per month.**

No usar “páginas generadas” como North Star.

## Acquisition

- qualified businesses/week;
- demo cost;
- demo publish rate;
- demo → claim start;
- claim → verified;
- verified → checkout;
- checkout → paid.

## Activation

- time to first live site;
- % onboarding completed;
- custom domain activation rate;
- first lead time.

## Product

- WA/phone/form intent events;
- leads per active site;
- customer login frequency;
- feature activation;
- publish success;
- support contacts/customer.

## Revenue

- MRR;
- ARPA;
- gross margin;
- CAC;
- payback;
- expansion MRR;
- churn;
- net revenue retention.

## Factory

- AI cost/site;
- human minutes/site;
- QA auto-pass rate;
- retry rate;
- rollback rate;
- site uptime;
- average build duration.

## Compliance

- provenance completeness;
- opt-out SLA;
- complaints;
- disputed claims;
- removals.

---

# 50. Unit Economics

## Fórmula principal

```text
Gross Margin per customer
= subscription revenue + add-ons
- payment fees
- infra allocation
- AI usage
- domain/custom-hostname allocation
- messaging costs
- support allocation
```

## Funnel economics

```text
Cost per acquired customer
= (demo generation + outreach + sales labor + paid acquisition)
  / new paying customers
```

## Ejemplo conceptual

Si generar y operar 100 demos cuesta US$50 total y produce 5 clientes, la generación aporta US$10 CAC antes de ventas/outreach. Si cada cliente tiene margen mensual de US$25, la generación se recupera rápidamente. Si produce 0 clientes, escalar a 10.000 demos solo multiplica el problema.

Por eso la fábrica debe tener **economic gates**:

- no duplicar volumen hasta conocer conversión;
- detener verticales con mala economía;
- aumentar inversión en verticales con payback fuerte.

## Cost ceiling automático

Cada workflow recibe `max_budget_usd`. Si el agente entra en loops y supera presupuesto, se detiene y escala.

---

# 51. Failure Scenarios

## F1 — Modelo IA caído

- AI Gateway retry;
- fallback provider;
- queue retry;
- trabajo queda pendiente, sitio público no afectado.

## F2 — Oracle runner caído

- queue retiene/reintenta;
- reemplazar instancia;
- no afecta static serving.

## F3 — Managed Postgres caído

- demos/sites ya materializados continúan por cache/R2;
- portal/control plane se degrada;
- no publicar cambios hasta recuperación.

## F4 — R2/asset issue

- health alert;
- fallback cached asset si existe;
- rehydrate desde backup para assets críticos.

## F5 — Mal deploy

- health check falla;
- snapshot anterior sigue activo;
- rollback automático.

## F6 — Información incorrecta

- owner/report flow;
- unpublish field/site según severidad;
- corregir Business Truth;
- rebuild.

## F7 — Claim fraud

- freeze edits;
- review evidence;
- restore prior owner;
- audit trail.

## F8 — Payment webhook duplicado

- signature verification;
- event idempotency;
- provider event ID unique constraint.

## F9 — Cost spike IA

- per-provider quotas;
- budget alerts;
- circuit breaker;
- switch cheap fallback;
- stop batch generation.

## F10 — Search engine deindexes pages

No debe comprometer el modelo comercial porque demos no dependen del SEO. Revisar TodoLima quality/data; no generar más contenido masivo.

---

# 52. Recovery Strategy

## RPO/RTO iniciales

### Public site snapshots

- RPO: última versión publicada;
- RTO: minutos mediante rollback/cache.

### PostgreSQL

- RPO objetivo MVP: <=24h; producción madura <=1h según provider;
- RTO: <4h MVP, mejorar con ingresos.

### Assets

- versioning/backup periódico de assets irremplazables del cliente.

## Backups

- managed DB PITR cuando plan lo permita;
- daily logical backup cifrado a storage alternativo;
- R2 inventory/version strategy;
- prompt/recipe/code en Git;
- quarterly restore drill cuando exista producción significativa.

## Exportabilidad

Mantener capacidad de exportar:

- Business data;
- Site config;
- assets;
- static snapshot.

Reduce lock-in y facilita customer offboarding.

---

# 53. Future Opportunities

1. **TodoLima verified profiles:** propietarios corrigen su presencia aun sin comprar web.
2. **Marketplace de servicios digitales:** add-ons de fotografía, branding, ads, video.
3. **Lead routing:** con consentimiento y transparencia, conectar demanda con negocios activos.
4. **Vertical micro-products:** booking dental, menus/restaurants, legal intake, beauty scheduling.
5. **Reputation intelligence:** centralizar feedback del cliente sin violar políticas de plataformas.
6. **AI receptionist:** voz/WhatsApp/web con handoff.
7. **Business benchmarking:** métricas agregadas por categoría, preservando privacidad.
8. **Partner/reseller program:** otras agencias usan la fábrica.
9. **White-label platform:** solo cuando licensing/support/ops estén maduros.
10. **Regional business graph:** extender el modelo a Perú y posteriormente LatAm.

---

# 54. Blind Spots / Oportunidades no consideradas

## 54.1 El mayor producto podría no ser la web

Si las webs atraen actividad, el verdadero producto de alto valor puede convertirse en **lead operations**: captura, respuesta, agenda, seguimiento y medición.

## 54.2 Owner verification como asset

Una base de negocios **reclamados y verificados** tiene mucho más valor que una base scrapeada. Diseñar el claim no solo como venta, sino como proceso de enriquecimiento del Business Graph.

## 54.3 “Free website” puede atraer clientes de bajo valor

Testear framing. Puede funcionar mejor:

- “demo lista para revisar”;
- “presencia digital preconstruida”;
- “auditoría + propuesta”.

Cobrar una activación filtra commitment.

## 54.4 Un sitio completo puede ser demasiado trabajo antes del interés

Por eso se recomienda Tier A/B/C. El sistema debería poder generar un **interactive preview barato** antes del full build.

## 54.5 Mantenimiento debe tener valor visible

Si la mensualidad solo significa “hosting”, el cliente preguntará por qué paga. El portal debe mostrar:

- uptime;
- analytics;
- leads;
- actualizaciones;
- cambios;
- recomendaciones;
- seguridad.

## 54.6 Un solo WhatsApp central puede crear confusión

Pre-claim, cualquier contacto debe decir claramente que llega a TodoLima/HazloCrecer, no fingir ser el negocio. Después del claim, el CTA debe dirigirse al negocio o a su agente autorizado.

## 54.7 Necesidad de un Content Correction API/UI

Permitir a cualquier negocio reportar datos incorrectos incluso sin comprar. Reduce riesgo reputacional y mejora dataset.

## 54.8 Accessibility como diferenciador

Agregar checks WCAG/axe puede elevar calidad y servir como selling point para ciertos segmentos.

## 54.9 Portability como argumento comercial

Ofrecer export estático/configuración al cliente en ciertos planes reduce miedo al lock-in y aumenta confianza.

---

# 55. Final Recommended Stack

## Public websites

- **Astro** — site component system/render/build.
- **Cloudflare Worker** — wildcard router/site delivery.
- **Cloudflare R2** — snapshots/assets.
- **Cloudflare KV** — hostname/snapshot cache.
- **Cloudflare CDN/TLS/WAF** — delivery/security.

## Core platform

- **TypeScript** como lenguaje principal de producto para compartir tipos entre UI/API/workers.
- **PostgreSQL** — source of truth.
- **Neon** inicialmente como managed Postgres, con Supabase/otro Postgres como alternativa.
- **React/Next.js o React Router** para customer/admin portal; elegir según experiencia del equipo.
- **Better Auth o managed auth** — no construir crypto/auth protocol.

## Async/automation

- **Trigger.dev** — durable workflows de IA/background; cloud free para validar y self-hostable si conviene.
- **Cloudflare Queues** — eventos/jobs cortos, buffering y desacoplamiento del edge.
- **Oracle Cloud VM** — n8n + browser/coding agent runners durante MVP.
- **n8n** — integrations, notifications, CRM/email glue.
- **OpenHands Agent SDK/Server** — coding jobs sandboxed.
- **Cline** — herramienta del desarrollador/fundador y prototipos de agentes.

## AI

- **Cloudflare AI Gateway** — gateway, telemetry, fallback.
- **Workers AI** — modelos open source económicos, incluido Qwen.
- **Gemini** — alternativa multimodal/económica según tier y privacidad.
- **OpenRouter/direct providers** — fallback/especialización.
- **Kaggle endpoint** — solo experimentación.

## Quality

- Playwright;
- axe-core;
- Lighthouse/PageSpeed checks;
- link checker;
- schema validator;
- secret/dependency scanning;
- screenshot + vision review secundaria.

## Product ops

- **PostHog** — funnel/product analytics.
- **Resend** inicialmente — transactional email; SES/Postmark al cambiar economía.
- **Mercado Pago/Culqi/provider actual** detrás de Billing Adapter.

## Source control

- **GitHub private monorepo** para plataforma.
- No repo por negocio como modelo por defecto.

---

# 56. Final Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                                DISCOVERY                                   │
│                              TODOLIMA.COM                                  │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │
                                     ▼
                         ┌──────────────────────┐
                         │ BUSINESS REGISTRY    │
                         │ + PROVENANCE/TRUTH   │
                         └──────────┬───────────┘
                                    │
                         Qualification / Tiering
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
            Audit/Research                       Directory only
                  │
                  ▼
        ┌───────────────────────┐
        │ BRAND + SITE PLANNING │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │ AI SITE FACTORY       │
        │ Astro + components    │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │ QA / POLICY GATES     │
        └───────────┬───────────┘
                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         GUIALIMA.ONLINE DEMOS                              │
│ wildcard Worker → KV mapping → versioned R2 snapshot                      │
│ noindex by default + transparent demo banner                              │
└──────────────────────┬───────────────────────────────┬─────────────────────┘
                       │                               │
                  Analytics                           Claim
                       │                               │
                       │                         Verification
                       │                               │
                       │                               ▼
                       │                    ┌────────────────────┐
                       │                    │ HAZLOCRECER.COM    │
                       │                    │ Plans / Checkout   │
                       │                    └─────────┬──────────┘
                       │                              ▼
                       │                    Billing Provider
                       │                              │ webhook
                       │                              ▼
                       │                 ┌────────────────────────┐
                       │                 │ SUBSCRIPTION +         │
                       │                 │ ENTITLEMENTS           │
                       │                 └──────────┬─────────────┘
                       │                            ▼
                       │                 ┌────────────────────────┐
                       └────────────────►│ CUSTOMER SAAS PORTAL   │
                                         └──────────┬─────────────┘
                                                    │
                                    content/domain/modules/agents
                                                    │
                                                    ▼
                                         Publish new snapshot
                                                    │
                                                    ▼
                                      Customer custom domain
                                                    │
                         ┌──────────────────────────┼─────────────────────────┐
                         ▼                          ▼                         ▼
                      Leads                     Analytics                 Agents
                         │                          │                         │
                         └──────────────────────────┼─────────────────────────┘
                                                    ▼
                                             GROWTH ENGINE
                                                    │
                                                    ▼
                                         RECURRING / EXPANSION

CONTROL PLANE:
PostgreSQL + API + Trigger.dev + Queues + n8n + Agent Runner + Admin Exception Dashboard

AI PLANE:
Cloudflare AI Gateway → Workers AI / Gemini / OpenRouter / premium providers /
custom self-hosted endpoints
```

---

# 57. 30 / 60 / 90-Day Action Plan

> Los días son una secuencia de ejecución, no una promesa de calendario. Avanzar por gates de calidad.

## Días 1–30 — Foundation

### Semana 1

- congelar scraping adicional de Maps mientras se revisa procedencia;
- exportar/inventariar dataset actual;
- clasificar campos por fuente;
- elegir 1 vertical para MVP;
- definir 10 negocios de prueba con datos que puedan verificarse por otras fuentes;
- abrir monorepo privado.

### Semana 2

- PostgreSQL schema v1;
- Business Truth admin;
- category/vertical recipe schema;
- Site Config schema;
- Astro component library inicial;
- Cloudflare dev environment.

### Semana 3

- wildcard `*.guialima.online`;
- Worker router;
- R2 assets/snapshots;
- render/build de una web;
- demo banner/noindex;
- Playwright basic QA.

### Semana 4

- AI Gateway;
- Brand/Content prompts versionados;
- Qwen/Gemini policies;
- job logs/costs;
- generar 10 demos controladas.

**Gate 30:** 8/10 demos pasan con mínima intervención y sin hechos inventados.

## Días 31–60 — Monetization path

- queues/retries/DLQ;
- qualification engine;
- PostHog product events;
- claim flow;
- owner verification;
- auth/orgs;
- billing adapter;
- sandbox/test checkout;
- subscription + entitlement tables;
- onboarding;
- customer structured editor;
- SiteVersion/preview/publish.

**Gate 60:** un owner de prueba completa claim → pago → configuración → publicación.

## Días 61–90 — Production readiness

- custom domain automation;
- dunning/grace states;
- email lifecycle;
- observability/alerts;
- data removal/correction workflow;
- consent/source registry;
- admin exception dashboard;
- 100-business controlled pilot;
- measured outreach test;
- pricing experiment;
- customer interviews.

**Gate 90:** métricas reales de coste, conversión y operación suficientes para decidir si escalar a 1.000.

---

# 58. Immediate Next Actions

Orden exacto recomendado:

1. **No escribir todavía todos los agentes.**
2. Auditar legal/provenance del dataset TodoLima.
3. Elegir un vertical MVP.
4. Definir `BusinessTruth.schema.json`.
5. Definir `SiteConfig.schema.json`.
6. Definir `VerticalRecipe.schema.json`.
7. Crear monorepo.
8. Provisionar Postgres de desarrollo.
9. Crear Cloudflare R2/KV/Worker de desarrollo.
10. Configurar wildcard de GuiaLima.
11. Construir una sola web mediante config.
12. Crear snapshot/version/rollback.
13. Crear QA determinista.
14. Añadir IA para Brand/Content solo después de que el renderer funcione.
15. Añadir Model Gateway y logging.
16. Generar 10 demos.
17. Medir diversidad, errores y coste.
18. Construir Claim.
19. Construir Billing/Entitlements.
20. Construir portal.
21. Conectar custom domain.
22. Pilotear con personas reales antes de producción masiva.

---

# Architecture Decision Record (ADR)

## ADR-001 — TodoLima no aloja la capa comercial principal

**Decisión:** TodoLima sigue siendo discovery/directory.  
**Razón:** preserva claridad de marca y utilidad.  
**Alternativa descartada:** convertir TodoLima en agencia/checkout.  
**Revisar:** si datos muestran que una oferta integrada mejora conversión sin perjudicar directorio.

## ADR-002 — GuiaLima aloja demos

**Decisión:** demos en wildcard `*.guialima.online`.  
**Razón:** aislar experimental/sales preview de marcas principales.  
**Alternativas:** HazloCrecer subdomains o rutas TodoLima.  
**Revisar:** si la marca GuiaLima genera confusión comercial.

## ADR-003 — Demos noindex por defecto

**Decisión:** `noindex` hasta claim/criterios de publicación.  
**Razón:** calidad, SEO, propiedad y datos.  
**Alternativa:** indexar todo para captar SEO.  
**Descartada porque:** riesgo de scaled content/doorway y contenido no verificado.

## ADR-004 — Un site engine multi-tenant

**Decisión:** no repo/deploy por negocio.  
**Razón:** escala, coste, updates globales, observabilidad.  
**Alternativa:** miles de repos/Pages projects.  
**Revisar:** solo para clientes enterprise con código aislado.

## ADR-005 — GitHub no es hosting comercial masivo

**Decisión:** GitHub para source/CI.  
**Razón:** Pages tiene límites y explícitamente no está pensado como hosting gratuito de SaaS/negocio.  
**Alternativa:** GitHub Pages por cliente.  
**Descartada.**

## ADR-006 — Cloudflare como public edge

**Decisión:** Workers + R2 + KV + custom hostnames.  
**Razón:** wildcard/multi-tenant, CDN, TLS, bajo coste, API.  
**Alternativas:** Netlify/Vercel/custom VPS.  
**Revisar:** si pricing o lock-in cambian materialmente.

## ADR-007 — PostgreSQL source of truth

**Decisión:** relational DB administrada.  
**Razón:** transacciones, relaciones, portability.  
**Alternativas:** D1/Firestore/Sheets.  
**Revisar:** no previsto; provider sí puede cambiar.

## ADR-008 — Oracle Free no guarda la única copia crítica

**Decisión:** usar como runner/control workloads.  
**Razón:** no SLA y recursos Always Free pueden ser reclamados en ciertas condiciones.  
**Alternativa:** DB y sistema entero en una VM.  
**Descartada para producción crítica.**

## ADR-009 — n8n no controla estados críticos

**Decisión:** integration automation.  
**Razón:** mantener negocio testeable/transaccional en código/DB.  
**Alternativa:** todo el backend en workflows visuales.  
**Descartada.**

## ADR-010 — Model Router / AI Gateway

**Decisión:** abstraction desde el inicio.  
**Razón:** modelos/precios cambian rápidamente.  
**Alternativa:** Qwen/Kaggle hard-coded.  
**Descartada para producción.**

## ADR-011 — Cline/OpenHands en lugar de coding agent propio

**Decisión:** integrar componentes existentes.  
**Razón:** SDK/CLI/tooling/sandbox existentes.  
**Alternativa:** framework de agente desde cero.  
**Revisar:** cuando throughput/seguridad exijan motor especializado.

## ADR-012 — Business Truth obligatorio

**Decisión:** facts con provenance antes de copy.  
**Razón:** evitar hallucination, disputas, riesgo legal/reputacional.  
**Alternativa:** LLM investiga y publica libremente.  
**Descartada.**

## ADR-013 — No usar datos scrapeados de Maps como base sin remediación

**Decisión:** Phase 0 de provenance.  
**Razón:** términos actuales de Maps restringen scraping/export/storage/rehosting.  
**Alternativa:** escalar inmediatamente.  
**Descartada por riesgo crítico.**

## ADR-014 — Custom domain solo tras activación

**Decisión:** demos usan GuiaLima; clientes conectan custom hostname.  
**Razón:** reduce coste/ops y diferencia demo/oficial.  
**Alternativa:** dominios por prospecto.  
**Descartada.**

## ADR-015 — Structured CMS, no page builder libre

**Decisión:** cliente edita datos/secciones controladas.  
**Razón:** consistencia, QA, soporte, seguridad.  
**Alternativa:** builder drag-and-drop completo.  
**Revisar:** si demanda premium lo justifica.

## ADR-016 — Feature entitlements centralizados

**Decisión:** plan → entitlements.  
**Razón:** upgrades/add-ons automáticos.  
**Alternativa:** condicionales hard-coded.  
**Descartada.**

## ADR-017 — Free tiers son bootstrap, no estrategia defensiva

**Decisión:** diseñar para pagar proveedores cuando haya tracción.  
**Razón:** fiabilidad y ToS.  
**Alternativa:** cuentas múltiples/evadir limits.  
**Descartada.**

---

# Fuente de verdad de implementación — contratos iniciales

Los siguientes artifacts deben crearse antes de escribir la mayor parte del backend:

```text
/contracts/business-truth.schema.json
/contracts/site-config.schema.json
/contracts/vertical-recipe.schema.json
/contracts/brand-profile.schema.json
/contracts/site-snapshot.schema.json
/contracts/agent-output.schema.json
/contracts/events/*.schema.json
/contracts/billing-provider.ts
/contracts/model-provider.ts
/contracts/storage-provider.ts
```

Los agentes deben devolver JSON/schema-valid output cuando el resultado vaya a alimentar automatizaciones.

---

# Recomendación de estructura del monorepo

```text
/apps
  /directory-todolima
  /marketing-hazlocrecer
  /customer-portal
  /admin-portal
  /api
  /site-router-worker

/packages
  /site-engine
  /design-system
  /vertical-recipes
  /business-truth
  /billing
  /entitlements
  /analytics
  /ai-gateway
  /agent-contracts
  /events
  /database
  /shared-types

/workers
  /queue-consumers
  /domain-manager
  /publisher

/agents
  /research
  /brand-content
  /site-planner
  /qa-review

/infra
  /cloudflare
  /oracle
  /docker

/prompts
  /research
  /brand
  /content
  /qa

/evals
  /verticals
  /hallucination
  /design

/docs
  /adr
  /runbooks
  /compliance
```

---

# Quality Gate Specification v1

Una demo no puede publicarse si falla un hard gate.

## Hard gates

- schema válido;
- business name presente;
- provenance mínima;
- sin hechos prohibidos/inventados detectados;
- build OK;
- no broken internal routes;
- no exposed secrets;
- responsive render válido;
- claim/demo disclosure visible;
- noindex aplicado;
- assets con source metadata;
- performance sin error crítico;
- form endpoints protegidos;
- HTTPS.

## Soft score

Puntuación 0–100:

- visual hierarchy: 20;
- copy clarity: 15;
- conversion UX: 15;
- mobile: 15;
- accessibility: 10;
- performance: 10;
- content completeness: 10;
- brand differentiation: 5.

Threshold inicial: 80. Calibrar con revisión humana.

---

# Site Status Machine

```text
DRAFT
 → GENERATING
 → QA_PENDING
 → QA_FAILED ───→ GENERATING/REVIEW
 → DEMO_READY
 → DEMO_PUBLISHED
 → CLAIM_PENDING
 → CLAIMED
 → ONBOARDING
 → PRODUCTION_PENDING
 → ACTIVE
 → PAST_DUE
 → SUSPENDED
 → CANCELLED
 → ARCHIVED
```

Separar estado del **sitio** de estado de **subscription** y estado de **claim** para evitar acoplamiento.

---

# Business Status Machine

```text
IMPORTED
 → PROVENANCE_PENDING
 → VERIFIED_ENOUGH
 → QUALIFIED
 → AUDITED
 → DEMO_ELIGIBLE
 → CUSTOMER
```

Un negocio puede existir sin sitio y sin customer.

---

# AI Governance

## Cada model call debe registrar

- purpose;
- model/provider;
- prompt version;
- input data references;
- output hash;
- token/compute cost;
- latency;
- validation result;
- fallback used;
- user/business scope.

## Datos sensibles

No enviar indiscriminadamente PII a modelos gratuitos que indiquen uso de datos para mejora del producto. La documentación actual de Gemini diferencia el tratamiento entre free y paid tiers; seleccionar provider/tier según sensibilidad.

## Model evaluations

No reemplazar un modelo porque “parece mejor” en una conversación. Comparar contra eval set y coste.

---

# Outreach Governance

Crear una capa que decida si un contacto es legal/permitido antes de que n8n envíe nada.

```text
can_contact(prospect, channel, purpose)
→ ALLOWED
→ CONSENT_REQUIRED
→ SUPPRESSED
→ MANUAL_REVIEW
```

Inputs:

- source;
- jurisdiction;
- channel;
- prior consent;
- prior opt-out;
- contact attempts;
- business/person classification;
- campaign purpose.

Esto evita que un workflow accidental envíe mensajes a toda la base.

---

# Data Provenance Remediation Plan

## Paso 1 — Inventory

Exportar todos los campos del dataset actual.

## Paso 2 — Tag sources

Por campo:

- Google-derived;
- business website;
- owner-supplied;
- social;
- other.

## Paso 3 — Publication policy

Definir `publishable / internal_only / must_reverify / delete`.

## Paso 4 — Re-enrichment

Para prospects prioritarios obtener facts desde fuentes permitidas.

## Paso 5 — Owner verification

Cuando el owner reclama, reemplazar facts externos por datos confirmados.

## Paso 6 — Audit trail

Conservar quién modificó qué y por qué.

---

# Pilot Design

No ejecutar el primer pilot con 3.800.

Seleccionar 30 negocios:

- 10 sin web;
- 10 con web anticuada;
- 10 con web razonable.

Dentro de un solo vertical o dos muy similares.

Medir:

- tiempo de research;
- coste IA;
- QA failures;
- percepción de la demo;
- respuesta del negocio;
- claim intent;
- disposición de pago.

Después decidir qué segmento merece fábrica completa.

---

# Go / No-Go Gates

## Go a 100 demos

- procedencia resuelta para el pilot;
- >80% auto-pass;
- sin claims falsos críticos;
- coste < presupuesto target;
- al menos señales positivas de mercado.

## Go a 1.000

- claim/billing funciona;
- unit economics preliminares;
- soporte por cliente sostenible;
- compliance operativo;
- rollback/monitoring probados.

## Go a 10.000+

- conversion repetible;
- MRR compensa infraestructura y equipo;
- data acquisition lawful y repeatable;
- exception rate bajo;
- DB/queues/load tests completados.

---

# Conclusión estratégica

La mejor versión de este proyecto no es una gran colección de sitios generados con IA. Es una **plataforma de transformación y operación digital de negocios locales**, donde el sitio es la primera interfaz tangible.

La mayor mejora respecto a la idea inicial es separar:

- descubrimiento;
- demo;
- venta;
- operación;
- datos;
- IA;
- publicación;
- medición.

Esa separación permite que TodoLima mantenga su valor como directorio, GuiaLima sea un entorno seguro de demostración, HazloCrecer sea una marca comercial coherente y el SaaS pueda operar miles de clientes sin crear miles de stacks independientes.

El orden de ejecución importa más que la cantidad de herramientas. Primero se resuelve procedencia, truth, site engine y QA; después claim, pago y autoservicio; después escala; y solo cuando el ciclo económico esté probado se incorporan agentes de crecimiento, marketing y automatización avanzada.

Si se sigue ese orden, la arquitectura puede escalar sin que cada cliente nuevo cree un nuevo cuello de botella humano.

---

# Appendix A — Herramientas adicionales exploradas

## Trigger.dev — ADOPT para workflows largos

**Uso:** durable AI jobs, report generation, site generation orchestration, waits, retries, approvals.  
**Por qué:** reduce el código de leases, heartbeats, retries y persistencia de workflows; TypeScript encaja con el stack; Apache-2.0/self-hostable.  
**No usar para:** sustituir la DB, servir sitios públicos o reemplazar n8n como catálogo de conectores.

## Inngest — TRIAL / alternativa

Muy buena alternativa durable/event-driven. El free tier actual es generoso en executions, pero la concurrencia gratuita es más baja. Mantener como opción si Trigger.dev no encaja en producción.

## Temporal — HOLD

Potente para workflows críticos a gran escala, pero exige un modelo operativo/mental más pesado. Reconsiderar cuando haya workflows financieros/operativos de larga duración que justifiquen esa inversión.

## LangGraph — HOLD para agentes cognitivos propios

Ofrece durable execution, persistence y human-in-the-loop para grafos de agentes. No se necesita para Site Factory v1 si OpenHands resuelve coding y Trigger.dev resuelve el workflow. Evaluarlo cuando existan agentes conversacionales/stateful que no encajen en pipelines simples.

## Cloudflare Browser Run — TRIAL para QA distribuido

Cloudflare permite Playwright/Puppeteer administrado. A fecha del análisis, Free ofrece minutos diarios limitados; Workers Paid incluye horas mensuales y cobra una tarifa baja por horas adicionales. Puede resultar más económico que mantener muchos browsers propios para screenshots/health QA.

Uso recomendado:

- screenshots de producción;
- smoke tests;
- mobile/desktop render checks;
- auditorías periódicas de sitios propios/permitidos.

Para coding agents con workspace complejo, mantener navegador en el sandbox del runner.

## Browserbase — HOLD

Infraestructura de navegador potente con proxies/identidades y alta concurrencia, pero innecesaria para MVP. Evaluar si aparecen browser agents avanzados que no puedan resolverse con Browser Run/Playwright.

## Kubernetes — AVOID en fases iniciales

No aporta valor frente a Workers + managed DB + durable task service + uno o pocos runners. Introducirlo únicamente si existe un problema probado de scheduling/isolated compute que no pueda resolver una plataforma administrada.

---

# Appendix B — Audit Engine specification

La auditoría debe separar **evidencia medible** de opinión generada por IA.

## Entradas

- URL existente, si la hay;
- Business Truth;
- objetivo/vertical;
- permisos y límites de crawling.

## Checks deterministas

- HTTP/TLS;
- mobile viewport;
- Core Web/performance approximations mediante Lighthouse/PageSpeed cuando corresponda;
- broken links;
- titles/descriptions;
- canonical/robots/sitemap;
- headings;
- schema;
- forms;
- CTA presence;
- accessibility con axe;
- image dimensions/alt;
- security headers básicos;
- contact consistency.

## Review asistida por IA

- claridad de propuesta;
- jerarquía visual;
- confianza;
- conversion friction;
- content gaps;
- brand coherence.

Cada finding guarda:

`evidence + severity + confidence + impact + recommendation + source`.

No publicar puntuaciones arbitrarias como “37/100” si no existe una metodología documentada.

## PDF

Generar primero un reporte HTML responsive como fuente. Convertirlo a PDF con Playwright únicamente cuando el prospecto/flujo lo necesite. El enlace web permite analytics y actualización; el PDF sirve para compartir/archivar.

## Video

No usar video generativo caro para todos. Para Tier A o prospectos que demostraron interés:

1. screenshots/scroll controlado del demo;
2. script personalizado basado en findings reales;
3. TTS;
4. composición templada;
5. CTA final.

Esto es más barato, consistente y verificable que generar escenas sintéticas.

---

# Appendix C — Browser QA strategy

## En cada publish

- desktop 1440px;
- mobile ~390px;
- route smoke tests;
- CTA links;
- form submission sandbox;
- console errors;
- layout overflow;
- screenshot diff frente a baseline cuando exista.

## Periódico

No repetir audit completo a diario. Health check liviano frecuente; QA profundo tras cambios relevantes y en ventanas programadas.

---

# Sources & Verification Notes

Fuentes consultadas o verificadas para este blueprint. **Revalidar precios y términos antes de producción**, porque pueden cambiar.

## Cloudflare

- Workers Pricing — https://developers.cloudflare.com/workers/platform/pricing/
- Workers Limits — https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare for SaaS / Plans — https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/
- Workers for Platforms pricing — https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/
- Platforms hostname routing — https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/hostname-routing/
- R2 pricing — https://developers.cloudflare.com/r2/pricing/
- R2 public buckets/custom domains — https://developers.cloudflare.com/r2/buckets/public-buckets/
- KV pricing — https://developers.cloudflare.com/kv/platform/pricing/
- Queues — https://developers.cloudflare.com/queues/
- Queues pricing — https://developers.cloudflare.com/queues/platform/pricing/
- Turnstile plans — https://developers.cloudflare.com/turnstile/plans/
- AI Gateway — https://developers.cloudflare.com/ai-gateway/
- AI Gateway fallbacks — https://developers.cloudflare.com/ai-gateway/configuration/fallbacks/
- AI Gateway custom providers — https://developers.cloudflare.com/ai-gateway/configuration/custom-providers/
- Workers AI pricing — https://developers.cloudflare.com/workers-ai/platform/pricing/
- Qwen2.5-Coder-32B — https://developers.cloudflare.com/workers-ai/models/qwen2.5-coder-32b-instruct/
- Astro on Cloudflare Workers — https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/

## GitHub

- GitHub Pages limits — https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- GitHub Actions billing — https://docs.github.com/en/billing/concepts/product-billing/github-actions
- Cline GitHub organization/repository — https://github.com/cline/cline
- OpenHands License — https://github.com/OpenHands/OpenHands/blob/main/LICENSE

## Coding agents

- Cline install / CLI / SDK docs — https://github.com/cline/cline/tree/main/docs
- OpenHands — https://github.com/OpenHands

## Google / SEO / Maps

- Google Maps Platform Terms — https://cloud.google.com/maps-platform/terms
- Places API policies — https://developers.google.com/maps/documentation/places/web-service/policies
- Google Search spam policies — https://developers.google.com/search/docs/essentials/spam-policies
- LocalBusiness structured data — https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Business Profile third-party policies — https://support.google.com/business/answer/7353941

## AI providers

- Gemini API pricing — https://ai.google.dev/gemini-api/docs/pricing
- Groq rate limits — https://console.groq.com/docs/rate-limits
- Groq Acceptable Use Policy — https://groq.com/acceptable-use-policy
- OpenRouter — https://openrouter.ai/docs

## Durable workflows / browser infrastructure

- Trigger.dev — https://trigger.dev/
- Trigger.dev Pricing — https://trigger.dev/pricing
- Inngest Pricing — https://www.inngest.com/pricing
- LangGraph — https://www.langchain.com/langgraph
- Cloudflare Browser Run Pricing — https://developers.cloudflare.com/browser-run/pricing/
- Browserbase Pricing — https://www.browserbase.com/pricing

## Operations/data/product

- PostHog product analytics — https://posthog.com/product-analytics
- Resend pricing — https://resend.com/pricing
- Neon — https://neon.com/
- Supabase pricing — https://supabase.com/pricing
- n8n license — https://docs.n8n.io/sustainable-use-license/

## Payments — Peru

- Mercado Pago Developers — https://www.mercadopago.com.pe/developers/
- Culqi Docs — https://docs.culqi.com/

## WhatsApp

- WhatsApp Business Messaging Policy — https://business.whatsapp.com/policy

## Peru data protection

- Autoridad Nacional de Protección de Datos Personales / MINJUSDH — https://www.gob.pe/anpd
- Reglamento de la Ley 29733, Decreto Supremo 016-2024-JUS — verificar texto vigente en fuentes oficiales antes del rollout comercial.

---

# Documento vivo

**Próxima revisión obligatoria del blueprint:** antes de Phase 4 (billing/claim en producción) o si ocurre cualquiera de estos eventos:

- cambio sustancial de Cloudflare pricing/limits;
- cambio de términos de fuentes de datos;
- elección de payment provider definitivo;
- cambio de jurisdicción/país;
- >1.000 sitios activos;
- >100 clientes de pago;
- incorporación de WhatsApp/voice agents;
- introducción de datos sensibles.

