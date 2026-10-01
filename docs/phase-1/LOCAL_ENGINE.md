# Fase 1 — Site Engine local

## Qué se entrega

Un motor Node.js que carga BusinessTruth, VerticalRecipe, BrandProfile y SiteConfig,
valida sus contratos y referencias, ejecuta gates y produce HTML/CSS navegables.
No usa modelos de IA ni servicios externos para renderizar. Es una implementación
inicial de demos informativas sintéticas; no es todavía un producto comercial.

El diseño incluye navegación por anclas, salto al contenido con teclado, disposición
adaptable, identidad visual de muestra y disclosure. Todo texto procedente de los
documentos se escapa antes de incluirlo en HTML. Los textos fijos del motor son
editoriales o avisos de demostración; no afirman servicios ni atributos del negocio.

## Flujo implementado

1. `loadInputs`: carga bytes originales y calcula SHA-256 de los cuatro JSON.
2. `gates`: valida esquema y reglas entre documentos antes de escribir archivos.
3. `render`: ordena secciones habilitadas y aplica componentes registrados.
4. `build`: escribe HTML, CSS, inputs y SiteSnapshot con QA not_run.
5. `qa:browser`: sirve en loopback, prueba con Chrome, escribe reporte y capturas,
   y actualiza solo el estado QA y su referencia en SiteSnapshot.
6. `start`: sirve los recursos de la demo en 127.0.0.1, nunca en una interfaz pública.

`dist/latest.json` apunta al build más reciente. El ID de build deriva de versión del
motor, hashes de inputs y contenido renderizado. Repetir el build reutiliza los mismos
archivos solo si siguen íntegros. Un build corrupto se rechaza; se puede generar en
otra carpeta de salida para investigar sin borrar evidencia.

HTML y CSS son inmutables dentro del directorio de build. Cada ejecución de QA añade
un directorio fechado; SiteSnapshot es metadata actualizable y apunta al último
resultado. Un reporte passed significa que pasaron las comprobaciones automatizadas
listadas, no una certificación ni una autorización para publicar.

## Componentes y campos de diseño

| Componente | Datos aceptados | Evidencia exigida |
|---|---|---|
| hero | headline | Coincide exactamente con `/identity/display_name` |
| about | body | Coincide exactamente con `/description` |
| services | items: service_id, name | Servicio existente, verificado y nombre con provenance por campo |

El registro `componentSchemas` en `packages/site-engine/index.cjs` cierra los objetos
de datos de estos componentes. El SiteConfig genérico original permanece intacto.
Se rechazan componentes y variantes sin implementación, claves extra y IDs inseguros.
El Golden Business usa hero/about; services tiene una prueba positiva y una de
rechazo por falta de evidencia. Su QA visual con varios servicios queda para la
fábrica de ejemplos de la siguiente fase.

Se aplican color_tokens, font_family, body_px, heading_px y layout_family. La familia
de layout soportada es single-column. Personality, audiencia, tono y cta_style son
metadata de propuesta en esta versión; no generan copy ni variantes automáticas.
La ilustración CSS es decorativa y fija para la demostración, sin activos del negocio.

## Gates y límites explícitos

- Solo mode demo, status DRAFT, tenant nulo, hostname .invalid, sin aliases.
- Noindex, banner y disclosure ficticio obligatorios; sin canonical ni claim externo.
- Solo fuentes de tipo other, URN `urn:todolima:fixture:*` y permiso de uso interno.
- may_generate_demo verdadero, may_index_demo falso y revisión humana requerida.
- Misma identidad de negocio, hashes vigentes y referencias correctas a receta y marca.
- Campos visibles, títulos SEO y descripciones deben coincidir con Truth verificado.
- Solo hard gates implementados: provenance, noindex y synthetic_disclosure.
- Features deshabilitadas y sin assets externos; no formularios, pagos ni contactos.

Los marcadores de fuente sintética son una convención de entrada, no prueba legal ni
protección ante falsificación intencional. El motor no debe recibir datos externos
no confiables como si estuvieran autorizados. La revisión humana y el repositorio
controlado siguen siendo necesarios. No se usa minimum_soft_score para aprobar:
el sistema de puntuación editorial aún no está implementado.

## Servidor de vista previa

`npm start` usa el último build, puerto 4173, dirección 127.0.0.1. Antes de servir
verifica hashes y carga los archivos en memoria. Solo expone index.html, styles.css
y robots.txt. No expone build-inputs, contratos ni el resto del disco. Rechaza Host
y Origin inesperados, métodos distintos de GET/HEAD y rutas no permitidas.

Añade X-Robots-Tag, CSP sin scripts/formularios, nosniff, no-store y no-referrer.
Estas defensas son para desarrollo local; no convierten el servidor en hosting
multi-tenant ni sustituyen autenticación. Para otra máquina, mover el proyecto y
ejecutarlo allí. No abrir puertos ni publicar este servidor.

## Uso y QA reproducible

```sh
npm ci --ignore-scripts
npm run check
npm start
```

Chrome es el navegador por defecto. En PowerShell, para Edge:

```powershell
$env:BROWSER_CHANNEL = 'msedge'
npm.cmd run qa:browser
```

Para usar Chromium descargado por Playwright:

```powershell
npx.cmd playwright install chromium
$env:BROWSER_CHANNEL = 'chromium'
npm.cmd run qa:browser
```

El navegador no se incluye en el ZIP. La instalación de dependencias y una eventual
descarga de Chromium necesitan Internet; render y pruebas usan recursos locales.

Entrada/salida alternativas, rutas relativas al directorio desde el que ejecutas:

```sh
node scripts/build.cjs examples/golden-business dist-alternativo
node scripts/qa-browser.cjs dist-alternativo/site-golden-001/ID_DEL_BUILD
```

`npm start` siempre toma `dist/latest.json`; para la salida alternativa se puede abrir
su HTML directamente o usar el módulo createPreview desde otra herramienta local.

## Próximas fases

1. Fábrica de 10 fixtures sintéticos: variar largo de textos, servicios y datos faltantes;
   ejecutar QA por build y comprobar aislamiento e idempotencia.
2. Ampliar componentes tipados y política de contenido con evidencias reales saneadas.
3. Revisar fuentes y derechos del primer negocio real antes de habilitar ese modo.
4. Adaptador de publicación a almacenamiento/hosting compartido, con gate de revisión,
   rollback e identidad de tenant. Aún no hay integración Cloudflare.
5. Claim, pagos, onboarding y portal tras validar ese circuito.
