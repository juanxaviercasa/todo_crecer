'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {loadInputs,gates,ensure,encode}=require('../site-engine/index.cjs');
const {buildExperience,renderExperience}=require('../real-estate-experience/index.cjs');
const {buildPilotRegistry,assertCatalogAssets,createUsageIndex,renderTrace}=require('../asset-publication/index.cjs');
const ROOT=path.resolve(__dirname,'../..');
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

const experiences={
  'catalogo-amplio':{
    eyebrow:'Selección residencial · Lima',
    headline:'Encuentra un lugar que encaje contigo.',
    intro:'Compara espacios con una lectura clara de ubicación, escala y forma de habitar.',
    primary:'Explorar propiedades',
    metric:['03','espacios seleccionados'],
    sectionTitle:'Una selección pequeña para mirar mejor',
    serviceTitle:'Buscar bien empieza por entender cómo quieres vivir',
    steps:[['01','Definimos tu búsqueda'],['02','Comparamos con contexto'],['03','Revisamos cada detalle']],
    quote:'Menos ruido. Mejores preguntas. Una decisión con perspectiva.'
  },
  'desarrollador-proyectos':{
    eyebrow:'Vivienda contemporánea · Lima',
    headline:'Proyectos pensados para la vida que viene.',
    intro:'Arquitectura, entorno y gestión reunidos en una presentación honesta de cada proyecto.',
    primary:'Conocer proyectos',
    metric:['03','conceptos residenciales'],
    sectionTitle:'Tres maneras de imaginar el próximo hogar',
    serviceTitle:'Del concepto a la entrega, con una sola visión',
    steps:[['01','Ubicación con propósito'],['02','Diseño que perdura'],['03','Proceso acompañado']],
    quote:'Construimos confianza mucho antes de construir metros cuadrados.'
  },
  'asesor-boutique':{
    eyebrow:'Asesoría inmobiliaria personal',
    headline:'Una decisión importante merece una mirada cercana.',
    intro:'Acompañamiento sereno para comprar, vender o encontrar un nuevo lugar sin perder de vista lo esencial.',
    primary:'Conocer el enfoque',
    metric:['01','asesoría a tu medida'],
    sectionTitle:'Espacios elegidos con criterio, no por volumen',
    serviceTitle:'Una conversación antes de cada recomendación',
    steps:[['01','Escuchamos tu momento'],['02','Curamos alternativas'],['03','Acompañamos la decisión']],
    quote:'El mejor inmueble también tiene que sentirse correcto para ti.'
  },
  'proyectos-lotes':{
    eyebrow:'Terrenos y nuevos comienzos',
    headline:'Un terreno claro para empezar.',
    intro:'Proyectos explicados con orden: ubicación, etapa, posibilidades y lo que aún necesita verificarse.',
    primary:'Ver proyectos',
    metric:['03','escenarios de proyecto'],
    sectionTitle:'Elige el punto de partida de tu próximo proyecto',
    serviceTitle:'Información concreta antes de imaginar el futuro',
    steps:[['01','Revisamos la ubicación'],['02','Aclaramos cada etapa'],['03','Ordenamos la decisión']],
    quote:'Un nuevo comienzo necesita entusiasmo, pero también información clara.'
  },
  'tasacion-propietarios':{
    eyebrow:'Estrategia para propietarios',
    headline:'Entender el valor cambia el siguiente paso.',
    intro:'Una lectura ordenada del inmueble, su contexto y las decisiones que preparan una mejor salida al mercado.',
    primary:'Ver el método',
    metric:['03','capas de análisis'],
    sectionTitle:'Referencias que ayudan a leer el mercado',
    serviceTitle:'Valor, presentación y estrategia en una misma ruta',
    steps:[['01','Leemos el inmueble'],['02','Contrastamos el contexto'],['03','Trazamos la estrategia']],
    quote:'Una cifra sirve cuando también explica qué hacer después.'
  }
};

function head(title,description,css='../styles.css'){
 return `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="stylesheet" href="${css}"></head>`;
}
function notice(){return '<div class="demo-bar"><span></span> DEMOSTRACIÓN FICTICIA · DATOS E IMÁGENES SINTÉTICOS · NO RECIBE CONSULTAS</div>';}
function header(profile,prefix=''){
 const short=profile.name.replace(/\s*[—-]\s*FICTICIO\s*$/i,'');
 return `<header class="site-header"><a class="brand" href="${prefix}index.html" aria-label="${esc(short)}, inicio"><span class="brand-mark">${esc(short.charAt(0))}</span><span>${esc(short)}<small>Inmobiliaria ficticia</small></span></a><nav aria-label="Navegación principal"><a href="${prefix}index.html#seleccion">Selección</a><a href="${prefix}index.html#metodo">Método</a><a href="${prefix}index.html#estudio">Estudio</a></nav><a class="header-action" href="${prefix}index.html#recorrido">Ver recorrido <span>↗</span></a></header>`;
}
function propertyCard(item,i){
 return `<article class="property-card"><a href="${item.id}.html" aria-label="Ver ${esc(item.name)}"><div class="property-image"><img src="../assets/${esc(item.image)}" alt="Visual sintético de ${esc(item.name)}"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(item.operation)}</b></div><div class="property-copy"><div><p>${esc(item.location)} · ${esc(item.area)}</p><h3>${esc(item.name)}</h3></div><strong>${esc(item.price)}</strong></div></a></article>`;
}
function profilePage(profile,catalog){
 const x=experiences[profile.archetype];ensure(x,'ARCHETYPE_UNSUPPORTED','Unsupported archetype');
 const short=profile.name.replace(/\s*[—-]\s*FICTICIO\s*$/i,'');
 const cards=catalog.items.map(propertyCard).join('');
 const steps=x.steps.map(([n,label])=>`<li><span>${n}</span><h3>${esc(label)}</h3><p>Información ordenada, supuestos visibles y decisiones que necesitan confirmación.</p></li>`).join('');
 const experience=renderExperience(buildExperience(profile,catalog),catalog);
 return `<!doctype html><html lang="es" data-archetype="${esc(profile.archetype)}">${head(short,x.intro)}<body>${notice()}${header(profile)}<main><section class="hero"><div class="hero-copy"><p class="eyebrow">${esc(x.eyebrow)}</p><h1>${esc(x.headline)}</h1><p class="hero-intro">${esc(x.intro)}</p><a class="button" href="#seleccion">${esc(x.primary)} <span>↓</span></a><div class="hero-metric"><strong>${x.metric[0]}</strong><span>${esc(x.metric[1])}<br>para esta demostración</span></div></div><figure class="hero-visual"><img src="../assets/${esc(catalog.items[0].image)}" alt="Escena residencial sintética"><figcaption><span>Visual conceptual</span><b>La identidad final se crea con el propietario</b></figcaption></figure></section>
<section class="statement" id="estudio"><p>Una presencia digital puede sentirse <em>propia</em> antes de tener todos los datos.</p><span>Este piloto demuestra dirección visual y estructura; cada afirmación real permanece pendiente de verificación.</span></section>
<section class="selection" id="seleccion"><div class="section-heading"><div><p class="eyebrow">Selección ficticia · 01—03</p><h2>${esc(x.sectionTitle)}</h2></div><p>${esc(catalog.disclosure)}</p></div><div class="property-grid">${cards}</div></section>${experience}
<section class="method" id="metodo"><div class="method-lead"><p class="eyebrow">Nuestro recorrido</p><h2>${esc(x.serviceTitle)}</h2><p>La experiencia cambia según el modelo de negocio, pero mantiene la misma regla: mostrar con claridad qué está confirmado y qué requiere una conversación.</p></div><ol>${steps}</ol></section>
<section class="editorial"><blockquote>“${esc(x.quote)}”</blockquote><div><p class="eyebrow">Dirección de marca</p><h2>Diseño editorial, lectura rápida y una identidad que puede crecer.</h2><p>Tipografía expresiva, fotografía protagonista, ritmo visual y contenidos diseñados para la intención de este tipo de cliente.</p></div></section>
<section class="journey" id="recorrido"><p class="eyebrow">Siguiente paso del piloto</p><h2>Convertir esta dirección en una experiencia real.</h2><p>Cuando un propietario autorice el proyecto, sus datos, fotografías, inventario y canales de contacto entrarán mediante un proceso de verificación.</p><span class="disabled-action" aria-disabled="true">Contacto desactivado en la demo</span></section></main>${footer(short)}</body></html>`;
}
function detailPage(profile,item){
 const short=profile.name.replace(/\s*[—-]\s*FICTICIO\s*$/i,'');
 return `<!doctype html><html lang="es">${head(item.name,item.summary)}<body>${notice()}${header(profile)}<main class="detail"><a class="back" href="index.html#seleccion">← Volver a la selección</a><section class="detail-hero"><div><p class="eyebrow">${esc(item.operation)} · ${esc(item.location)}</p><h1>${esc(item.name)}</h1><p>${esc(item.summary)}</p></div><strong>${esc(item.price)}</strong></section><figure class="detail-image"><img src="../assets/${esc(item.image)}" alt="Visual sintético de ${esc(item.name)}"><figcaption>Imagen conceptual generada para el piloto. No representa una propiedad disponible.</figcaption></figure><section class="detail-facts"><div><span>Área</span><strong>${esc(item.area)}</strong></div><div><span>Distribución</span><strong>${esc(item.bedrooms)}</strong></div><div><span>Servicios</span><strong>${esc(item.bathrooms)}</strong></div></section><section class="detail-story"><div><p class="eyebrow">Una forma de habitar</p><h2>Espacio, luz y una lectura tranquila del día a día.</h2></div><div><p>${esc(item.summary)}</p><ul>${item.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><p class="legal-note">Precio, características, ubicación y disponibilidad son datos completamente ficticios.</p></div></section></main>${footer(short)}</body></html>`;
}
function footer(short){return `<footer><div><b>${esc(short)}</b><span>Demostración ficticia para validación visual</span></div><p>Sin relación con una empresa real · Sin formularios · Sin transacciones</p><a href="#top">Arriba ↑</a></footer>`;}

function renderProfile(profile,inputDirectory,outputDirectory,catalog,registry=buildPilotRegistry(ROOT)){
 ensure(catalog.synthetic===true,'CATALOG_BLOCKED','Visual catalog must be synthetic');
 const bundle=loadInputs(inputDirectory);const checked=gates(bundle);
 ensure(checked.config.site_id===profile.id,'PROFILE_MISMATCH','Profile differs from validated SiteConfig');
 ensure(checked.truth.identity.display_name===profile.name,'PROFILE_MISMATCH','Profile name differs from validated truth');
 assertCatalogAssets(registry,catalog,path.join(ROOT,'pilot/assets'),'local_demo');
 fs.mkdirSync(outputDirectory,{recursive:true});
 fs.writeFileSync(path.join(outputDirectory,'index.html'),profilePage(profile,catalog));
 for(const item of catalog.items)fs.writeFileSync(path.join(outputDirectory,item.id+'.html'),detailPage(profile,item));
 return {profile_id:profile.id,archetype:profile.archetype,pages:1+catalog.items.length,indexing:checked.config.seo.indexing,publication:'not_published'};
}

function landing(profiles){
 const cards=profiles.map((p,i)=>{const x=experiences[p.archetype];return `<a class="showcase-card" href="${p.id}/index.html"><span>${String(i+1).padStart(2,'0')} / ${esc(p.archetype.replaceAll('-',' '))}</span><h2>${esc(p.name.replace(/\s*[—-]\s*FICTICIO\s*$/i,''))}</h2><p>${esc(x.headline)}</p><b>Explorar dirección <i>↗</i></b></a>`;}).join('');
 return `<!doctype html><html lang="es">${head('Experiencias inmobiliarias · 5 modelos','Cinco experiencias inmobiliarias ficticias con módulos de conversión diferenciados.','styles.css')}<body class="showcase">${notice()}<main><header class="showcase-hero"><p>TODO LIMA × HAZLOCRECER · FASE 10</p><h1>Un motor.<br><em>Cinco recorridos.</em></h1><div><p>Cada negocio ficticio combina una dirección visual propia con un módulo útil para la decisión de su cliente.</p><span>Todo permanece local, noindex y sin contactos reales.</span></div></header><section class="showcase-grid">${cards}</section><footer><div><b>Experiencias 0.12.0</b><span>Arquitectura común · Conversión diferenciada</span></div><p>Datos y marcas ficticios</p></footer></main></body></html>`;
}

function buildAll(){
 const spec=JSON.parse(fs.readFileSync(path.join(ROOT,'pilot/profiles.json'),'utf8'));
 const catalog=JSON.parse(fs.readFileSync(path.join(ROOT,'pilot/catalog.json'),'utf8'));
 const registry=buildPilotRegistry(ROOT);
 const destination=path.join(ROOT,'dist/visual-pilot');
 fs.rmSync(destination,{recursive:true,force:true});fs.mkdirSync(path.join(destination,'assets'),{recursive:true});
 fs.copyFileSync(path.join(ROOT,'pilot/assets/coastal.png'),path.join(destination,'assets/coastal.png'));
 fs.copyFileSync(path.join(ROOT,'pilot/assets/courtyard.png'),path.join(destination,'assets/courtyard.png'));
 fs.copyFileSync(path.join(ROOT,'pilot/assets/garden.png'),path.join(destination,'assets/garden.png'));
 fs.copyFileSync(path.join(__dirname,'styles.css'),path.join(destination,'styles.css'));
 const results=spec.profiles.map(profile=>renderProfile(profile,path.join(ROOT,'pilot/generated-inputs',profile.id),path.join(destination,profile.id),catalog,registry));
 const usageIndex=createUsageIndex(registry,spec.profiles,catalog);
 fs.writeFileSync(path.join(destination,'index.html'),landing(spec.profiles));
 fs.writeFileSync(path.join(destination,'asset-registry.json'),encode(registry));
 fs.writeFileSync(path.join(destination,'asset-usage-index.json'),encode(usageIndex));
 fs.writeFileSync(path.join(destination,'asset-trace.html'),renderTrace(registry,usageIndex));
 fs.writeFileSync(path.join(destination,'visual-manifest.json'),encode({version:'0.13.0',synthetic:true,count:results.length,experience_modules:results.length,asset_registry_id:registry.registry_id,asset_usage_index_id:usageIndex.index_id,results}));
 return {destination,results,registry,usageIndex};
}
module.exports={experiences,renderProfile,buildAll,profilePage,detailPage,landing};
