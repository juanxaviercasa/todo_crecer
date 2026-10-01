# Contratos ejecutables de Phase 0

## Compatibilidad y alcance

Paquete 0.2.0, documentos 0.1.0, JSON Schema Draft 2020-12.
BusinessTruth, VerticalRecipe y SiteConfig se conservan byte por byte respecto al
starter. Los `$id` bajo `https://schemas.hazlocrecer.com/` son identificadores lógicos;
el validador los registra localmente. No se presupone que exista un registro web.
Los contratos nuevos son iniciales: deben congelarse/versionarse antes de consumidores
productivos. No cambiar silenciosamente el significado de un esquema ya publicado.

## Documentos

| Contrato | Responsabilidad | Referencias |
|---|---|---|
| BusinessTruth | Hechos, fuentes, provenance y política de publicación | source_ids internos |
| VerticalRecipe | Requisitos del vertical, componentes, CTA, SEO y gates | rutas JSON Pointer de Truth |
| BrandProfile | Propuesta visual y editorial separada de hechos | business_id, Truth y Recipe con hash |
| SiteConfig | Configuración declarativa original | Truth, Recipe, brand_profile_ref |
| SiteSnapshot | Manifiesto inmutable de los archivos de un build | hashes de Config, Truth, Recipe y Brand |
| AgentOutput | Resultado tipado, entradas, advertencias y errores | documento embebido que valida su contrato |

`brand_profile_ref` identifica `brand_profile_id` dentro del negocio; no es una URL.
El almacenamiento deberá resolverlo con ámbito de negocio y versión inmutable.
SiteSnapshot congela el hash exacto del perfil usado. `recipe_version` y
`business_truth_version` corresponden aquí a `schema_version` porque los contratos
originales no separan versión de esquema y revisión de contenido. El hash distingue
revisiones del contenido; añadir revisiones explícitas requiere un cambio futuro.

BrandProfile separa `facts` (texto y evidence), `editorial_framing` y `suggestions`.
Una sugerencia lleva `publish: false`. `proposed` no significa aprobada por el dueño.
Audiencia, colores y personalidad son propuestas editoriales; no hechos sobre un
negocio. En el fixture, los hechos coinciden literalmente con campos de Truth.
El uso productivo de paráfrasis requerirá una evaluación semántica adicional.

SiteSnapshot enumera rutas relativas, tipos MIME, SHA-256 y bytes. Su entrypoint debe
existir en artifacts. Un documento publicado exige QA passed, referencia a informe y
URL HTTPS; esto solo comprueba la estructura, no certifica que el informe exista ni
autoriza publicación. El ejemplo está `not_published`, QA `not_run`, URL nula.
`build.engine_version` identifica explícitamente una muestra estática.

AgentOutput permite succeeded, needs_review o failed. Failed requiere error y no
permite output; los otros dos estados requieren documento y error nulo. Succeeded
significa resultado del agente, no aprobación comercial, legal ni permiso de
publicación. El resultado embebido soporta los cinco contratos de datos; no admite
un objeto arbitrario como salida de automatización. Las referencias de inputs son
rutas relativas al repositorio en esta versión. No almacenar tokens ni secretos.

## Eventos iniciales

Envelope inspirado en CloudEvents 1.0, limitado al transporte JSON de este proyecto.
Se usa `specversion: 1.0`, UUID, source URN, type, subject, time, datacontenttype y
dataschema, con extensiones correlationid, causationid y businessid. No constituye
una implementación de transporte CloudEvents. `dataschema` identifica el contrato
completo del evento; `data` contiene versión, hash y documento tipado.

| Tipo (prefijo `com.hazlocrecer.`, sufijo `.v1`) | Documento | subject |
|---|---|---|
| business-truth.validated | BusinessTruth | business_id |
| brand-profile.generated | BrandProfile | brand_profile_id |
| site-config.created | SiteConfig | site_id |
| site-snapshot.created | SiteSnapshot | snapshot_id |
| agent.succeeded | AgentOutput succeeded | run_id |
| agent.failed | AgentOutput failed | run_id |

`events/event.schema.json` acepta exclusivamente estos seis eventos. Validated indica
validación del contrato; no verificación del negocio en el mundo real. Created no
implica publicado. El evento de fallo es un escenario independiente simulado, con
causationid nulo, y no la continuación de una ejecución ya exitosa.

Los consumidores futuros deben deduplicar por `(source, id)`. Una retransmisión
conserva id, time y payload; una nueva operación tiene nuevo id. correlationid une
el flujo y causationid refiere al evento causante; el primero es nulo. Los ejemplos
son un flujo acotado y el validador exige que sus padres estén presentes y que no
haya ciclos. En un consumidor real los padres pueden estar fuera del lote recibido.
No hay garantía de entrega, orden, reintentos o cola implementada en esta entrega.
Definir persistencia, idempotencia y dead-letter queue antes de integrar automatizaciones.

## Integridad y validación

SHA-256 se calcula sobre bytes UTF-8 exactos del archivo, incluyendo espacios y salto
de línea final. Los ejemplos JSON se serializan con dos espacios y LF final.
No es JSON canónico RFC 8785: cambiar formato cambia el hash. Los documentos embebidos
en eventos corresponden al mismo objeto del archivo, y artifact_hash refiere a los
bytes del archivo original. Persistir esos bytes junto al digest; no reserializar
arbitrariamente para verificarlo. Los hashes prueban integridad, no autenticidad.

`scripts/validate.cjs` carga todos los esquemas, valida sus metaschemas y referencias,
habilita formatos de fecha, URI, UUID y JSON Pointer, y valida todos los ejemplos.
Luego comprueba el flujo sintético: pertenencia al negocio, fuentes, rutas, receta,
hechos, secciones, hashes, tamaños reales, referencias de eventos y causalidad.
Las pruebas negativas prueban rechazo de entradas inválidas y corrupción del flujo.

Las reglas entre documentos están en código porque JSON Schema no consulta otros
archivos. El chequeo Golden Business es deliberadamente específico al fixture; no es
todavía un motor general de políticas ni un validador para cualquier dataset.
`SiteConfig.sections[].data` sigue siendo abierto en el starter: aquí el checker
comprueba hero y about, pero faltan contratos por componente para el motor futuro.

## Procedencia y publicación

El fixture tiene una fuente sintética de uso interno. source_verified significa
solo que coincide con esa fuente, nunca que se verificó un comercio real.
No hay contacto, dirección, precio, reseña ni activo atribuido a una persona real.
El hostname termina en `.invalid`, las funciones están deshabilitadas y la muestra
incluye disclosure y noindex. Noindex no es control de acceso ni permiso de uso.

Antes de datos reales: resolver cada fuente, comprobar los permisos aplicables al
uso previsto y conservar evidencia, verificar campos, tratar disputas y bloquear
datos sin autorización. Ningún estado de estos JSON sustituye revisión humana o
evidencia. Antes de publicar: implementar gates efectivos, QA real de contenido,
accesibilidad, seguridad y navegación, y control de acceso para demos privadas.
