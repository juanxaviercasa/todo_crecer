# TodoLima / HazloCrecer — revisión de repositorios y elección del primer sector

## Decisión recomendada

Comenzar el siguiente prototipo comercial por **agentes inmobiliarios**, con dos
direcciones visuales para el mismo negocio sintético y una estructura que pueda
personalizarse de verdad. Aprovechar el conocimiento y componentes de los repositorios
existentes; el motor local de Fase 1 queda como prueba de contratos, no como base visual.

La elección se apoya en madurez del producto existente y oportunidad de reutilización,
no en una promesa de rentabilidad. El ranking de poder adquisitivo del repositorio es
una hipótesis escrita en código, no evidencia de ventas ni investigación de mercado.

## Alcance y evidencia

- TodoLima: `juanxaviercasa/todo_lima`, commit `715861f626cccb1ebce4d5fd02ac491d724de3b1`.
- HazloCrecer: `juanxaviercasa/hazlo-crecer`, commit `b72e13f4657fdee59a74afc8a58d4ba7c78e4aa5`.
- Se leyeron los 38 archivos `data/*.json` de TodoLima y se agregaron sus registros.
- Se inspeccionaron generador, receta de nichos, ranking, auditor, parser de teléfonos,
  página de demos y componentes/servicios clave de HazloCrecer.
- Se observaron en navegador la portada de TodoLima y la demo inmobiliaria
  `/demo/agentes-inmobiliarios/biz_5`.
- HazloCrecer.com devolvió una página Cloudflare 525 durante la inspección; esa página
  mostraba 2026-09-30 03:35:21 UTC. El propietario aclaró que el DNS está en transición
  a Cloudflare y facilitó `https://hazlo-crecer.pages.dev`. En ese dominio provisional
  sí se verificaron visualmente la portada y la entrada al formulario de auditoría.
- No se ejecutaron scrapers, no se enviaron formularios ni mensajes y no se modificaron
  repositorios remotos, DNS o despliegues. No es una auditoría exhaustiva de seguridad.

## Lo que ya existe y conviene aprovechar

**TodoLima** usa Next.js/React y tiene directorios por categoría, rutas de demos,
datos organizados, auditoría y agrupación de 38 categorías en siete nichos. La demo
inmobiliaria ya tiene fotografía de portada, composición editorial, presentación del
profesional, cartera, servicios, metodología y recorridos separados de compra/venta.
La fotografía, jerarquía y estructura observadas son una referencia más pertinente
para el producto comercial que el ejemplo técnico mínimo construido anteriormente.

Reutilizar de forma selectiva la navegación, tarjetas, organización de servicios,
patrones de contacto y lectura de datos. Convertirlos en componentes configurables,
sin transportar automáticamente los textos, teléfonos, reseñas o propiedades fijas.
Las imágenes existentes necesitan procedencia y autorización antes de usarlas como
activos reales de otro negocio.

**HazloCrecer** usa React/Vite y contiene una web comercial, un formulario de auditoría
de seis pasos, validación Zod, componentes de comparación y ROI, rutas de resultados,
administración e integración PocketBase. Conviene mantenerlo como captación comercial
y onboarding. La presencia del código no confirma que esas integraciones estén
operativas en producción. La portada provisional carga y el enlace de auditoría abre
el primer paso del formulario; no se enviaron datos para comprobar el backend.

Visualmente, HazloCrecer ya tiene una identidad oscura/verde, tipografía de gran escala
y una estructura comercial extensa. Conviene conservar esa identidad y mejorar la
claridad: la promesa principal es larga, el aviso flotante de WhatsApp se superpone
al contenido visible y aparecen múltiples métricas de rendimiento que requieren
evidencia. El estilo de la agencia no debe imponerse a los sitios de sus clientes.

No hay una razón demostrada para reescribir ambos productos ni fusionarlos en esta
etapa. El trabajo compartido debe concentrarse en contratos, componentes de sitios,
políticas de contenido y un adaptador que lea la estructura de datos existente.

## Inventario comprobado

El CSV adjunto contiene el agregado de las 38 categorías. Son **3.268 registros**, no
3.268 negocios únicos confirmados: no se realizó deduplicación entre categorías.
226 registros contienen un valor no vacío en `website`, incluidos posibles perfiles
sociales; 444 contienen `phone`. Estos valores no verifican vigencia, titularidad,
disponibilidad de WhatsApp ni autorización para contactar.

| Categoría | Registros | Web registrada | Teléfono registrado |
|---|---:|---:|---:|
| Agentes inmobiliarios | 70 | 11 | 15 |
| Carpinteros | 100 | 23 | 72 |
| Pintores | 100 | 31 | 63 |
| Gasfiteros | 81 | 26 | 54 |
| Dentistas | 100 | 13 | 19 |
| Catering | 70 | 10 | 14 |
| Salones de belleza | 100 | 0 | 0 |
| Barberías | 100 | 0 | 0 |
| Spas | 100 | 0 | 0 |

18 categorías no tienen ningún valor registrado en website ni phone. No se encontró
contenido en los campos estándar images/photos/image examinados dentro de los
registros; esto no significa que el repositorio carezca de imágenes en public/.

**Dato ausente no equivale a ausencia de servicio.** El auditor convierte URL ausente
en NO_WEBSITE. Por tanto, el reporte de “93% sin web” no permite afirmar que ese
porcentaje de negocios realmente carezca de sitio. Debe existir estado desconocido
y verificación independiente antes de usarlo como argumento de venta.

## Problemas concretos que afectan el valor y la confianza

1. **Contenido rellenado sin evidencia.** `prototypeGenerator.js:132–134` introduce
   valoración 4.9, 48 reseñas y dirección de ejemplo cuando faltan valores. Desde
   la línea 180 construye testimonios fijos bajo el nombre verifiedReviews. La demo
   publicada los muestra como opiniones verificadas. Deben retirarse o identificarse
   explícitamente como contenido ficticio; no hay trazabilidad de esas reseñas en
   este generador.
2. **Una página inmobiliaria tratada como plantilla general.** La ruta acepta category/id,
   pero el generador y la página mantienen mensajes, cartera y argumentos inmobiliarios.
   `isSilvana` depende de `id === 'biz_5'` sin comprobar categoría, y existe teléfono
   de respaldo fijo. Los IDs locales repetidos entre categorías pueden activar la
   personalización incorrecta. Además, cuando no se encuentra un negocio, la página
   puede seleccionar el primero del archivo; debe devolver un estado de no encontrado.
3. **Falta de distinción entre móvil y WhatsApp verificado.** `parsePhone` normaliza
   números y detecta formato móvil. El auditor cuenta isMobile, mientras el resumen
   lo presenta como WhatsApp verificado. No es una comprobación de la cuenta WhatsApp.
4. **Promesas y casos comerciales sin evidencia enlazada.** HazloCrecer contiene casos
   y métricas fijadas en CASE_STUDIES. El código revisado no acredita esos resultados.
   Validarlos contra documentación o presentarlos como escenarios ilustrativos.
5. **Transición de dominio de HazloCrecer.** El dominio personalizado devolvió 525,
   mientras que el provisional Pages carga. El propietario informa de actualización
   DNS hacia Cloudflare. Revalidar dominio personalizado y TLS cuando termine esa
   transición; no se ha demostrado un fallo de la aplicación ni la causa específica
   del 525. La revisión de diseño puede avanzar usando el dominio provisional.

Estos hallazgos no implican que todos los datos del proyecto sean falsos. Identifican
casos específicos en los que el código no conserva la separación entre dato,
propuesta editorial y ejemplo.

## Clasificación de diseños propuesta

Conservar las 38 categorías para navegación y búsqueda. Añadir una clasificación
independiente para la experiencia de compra:

| Familia de experiencia | Categorías iniciales | Recorrido principal |
|---|---|---|
| Inmobiliaria | Agentes inmobiliarios | Propietario que quiere vender / comprador que busca inmueble |
| Proyectos y portafolio | Carpinteros, pintores, vidrierías | Explorar trabajos y solicitar cotización |
| Servicio urgente | Cerrajeros, gasfiteros, auxilio mecánico | Confirmar cobertura y contactar |
| Citas y tratamientos | Salud; belleza con recetas separadas | Comprender servicio, confianza y disponibilidad |
| Servicios profesionales | Abogados, contadores, notarías | Evaluar especialidad y solicitar consulta |
| Eventos | Catering, fotografía, tortas | Explorar estilo y cotizar fecha/tamaño |
| Taller y diagnóstico | Talleres, reparación de equipos | Identificar necesidad, proceso y presupuesto |

Una categoría puede tener más de una receta: mantenimiento preventivo y emergencia
no requieren el mismo recorrido. Inmobiliaria debe salir del grupo de diseño legal,
aunque la taxonomía comercial histórica la mantenga allí temporalmente.

## Brief del primer piloto

**Categoría:** agentes inmobiliarios. **Primera demostración:** identidad sintética,
sin atribuir cartera, credenciales o resultados de ejemplo a una persona real.

Dos propuestas para el mismo contenido:

- **Editorial boutique:** fotografía protagonista, tipografía editorial, composición
  espaciosa y foco en el asesor y la captación de propietarios.
- **Contemporánea orientada a búsqueda:** catálogo como entrada principal, filtros
  de operación/tipo de inmueble, información clara y solicitud de visita.

La diferencia debe ser de composición y recorrido, no un cambio de paleta. Ambas
deben incluir portada, cartera de muestra etiquetada, detalle de inmueble, perfil,
servicios, proceso para propietarios, preguntas relevantes y contacto. En el prototipo,
los formularios no deben enviar consultas a personas reales.

Los atributos verificables de propiedades, disponibilidad, fotos, identidad, registro
profesional, contacto y testimonios deben provenir de datos aprobados cuando se
conecte un negocio real. No completar información faltante con promesas de rentabilidad,
operaciones cerradas, garantías legales o reseñas inventadas.

**Criterios de revisión:** jerarquía visual cuidada, legibilidad móvil, distinción
inmediata entre comprar y vender, detalles suficientes para decidir, contacto sin
fricción, contenido específico, imágenes pertinentes y procedencia registrada.
Las pruebas de navegador son un requisito técnico adicional, no una medida de calidad
comercial ni una prueba de conversión. La conversión deberá medirse con tráfico real.

Tras elegir una dirección, aplicarla a tres perfiles distintos dentro de inmobiliaria.
El segundo piloto recomendado es carpintería/muebles a medida: permite una experiencia
distinta, centrada en portafolio y presupuesto, y tiene mayor cobertura de contactos
en los archivos actuales. Belleza queda como candidato posterior a completar datos.

## Uso propuesto de los dominios

Inventario declarado por el propietario; no se verificó titularidad, DNS ni
configuración de los dominios adicionales.

| Dominio | Función propuesta | Acción ahora |
|---|---|---|
| todolima.com | Directorio, descubrimiento por rubro y distrito | Aprovechar y mejorar el producto existente |
| hazlocrecer.com | Marca comercial, auditoría, oferta y onboarding | Usar pages.dev durante la transición DNS y revalidar el dominio al terminar |
| guialima.online | Demos identificadas y aisladas por negocio | Preparar integración futura; aún sin despliegue |
| hazlocrecer.es | Expansión específica a España | Reservar hasta tener oferta y contenido local |
| hazlocrecer.info | Reserva de marca; eventualmente ayuda/documentación | No crear otro sitio ahora |
| hazlocrecer.store | Reserva para una futura oferta transaccional | No implementar comercio hasta definir necesidad |

La disponibilidad de dominios no obliga a abrir nuevos productos. Clientes de pago
podrán usar su propio dominio; guialima.online puede quedar como espacio de muestra.
Demos públicas requieren autorización, disclosure y noindex; para revisión privada,
añadir control de acceso porque noindex no impide acceso ni compartición.

## Fuentes de código

- [Inventario de datos de TodoLima](https://github.com/juanxaviercasa/todo_lima/tree/715861f626cccb1ebce4d5fd02ac491d724de3b1/data)
- [Nichos y mapeo](https://github.com/juanxaviercasa/todo_lima/blob/715861f626cccb1ebce4d5fd02ac491d724de3b1/auditor/config/nicheTemplates.js)
- [Generador de prototipos](https://github.com/juanxaviercasa/todo_lima/blob/715861f626cccb1ebce4d5fd02ac491d724de3b1/auditor/engine/prototypeGenerator.js#L126)
- [Página de demos](https://github.com/juanxaviercasa/todo_lima/blob/715861f626cccb1ebce4d5fd02ac491d724de3b1/app/demo/%5Bcategory%5D/%5Bid%5D/page.js#L69)
- [Clasificación de webs](https://github.com/juanxaviercasa/todo_lima/blob/715861f626cccb1ebce4d5fd02ac491d724de3b1/auditor/engine/webAuditor.js#L30)
- [Parser de teléfonos](https://github.com/juanxaviercasa/todo_lima/blob/715861f626cccb1ebce4d5fd02ac491d724de3b1/auditor/engine/districtExtractor.js#L95)
- [Resultados HazloCrecer](https://github.com/juanxaviercasa/hazlo-crecer/blob/b72e13f4657fdee59a74afc8a58d4ba7c78e4aa5/src/pages/Resultados/Resultados.jsx#L6)
- [Formulario comercial](https://github.com/juanxaviercasa/hazlo-crecer/blob/b72e13f4657fdee59a74afc8a58d4ba7c78e4aa5/src/components/AuditForm/AuditForm.jsx)
