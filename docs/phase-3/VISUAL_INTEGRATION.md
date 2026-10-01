# Fase 3 — integración del motor visual inmobiliario

## Decisión

El sistema no usa una plantilla idéntica para todos los negocios. Usa una base técnica común y selecciona una experiencia según la intención comercial del perfil:

| Arquetipo | Trabajo principal de la página | Composición |
|---|---|---|
| Catálogo amplio | Ayudar a comparar inmuebles | Selección visual y fichas |
| Desarrollador | Explicar proyectos y confianza técnica | Proyecto, visión y proceso |
| Asesor boutique | Transmitir criterio y cercanía | Relato editorial y método |
| Proyectos/lotes | Ordenar ubicación, etapa y posibilidades | Recorrido de decisión |
| Tasación | Preparar al propietario para decidir | Método, contexto y estrategia |

No son cinco plantillas cerradas. Son cinco recetas de experiencia que pueden compartir componentes sin producir páginas intercambiables.

## Flujo ejecutado

```text
BusinessTruth → VerticalRecipe → BrandProfile → SiteConfig
       ↓              gates centrales
perfil + catálogo sintético → renderer inmobiliario → portada + fichas
       ↓
manifest noindex / not_published
```

`packages/real-estate-renderer/index.cjs` llama a `loadInputs()` y `gates()` antes de escribir una salida de perfil. También comprueba que el ID y el nombre recibidos coincidan con los documentos validados. Un catálogo que no declare `synthetic: true` se rechaza.

## Contenido y activos

Las cinco marcas, los tres inmuebles, precios, ubicaciones descriptivas y fotografías son material ficticio de demostración. Las empresas reales estudiadas no aparecen en el HTML, no se reutilizan sus imágenes, teléfonos, correos, propiedades ni textos. Su única función fue ayudar a identificar tipos de experiencia.

La capa visual incluye:

- portada comparativa del piloto;
- portada propia para cada arquetipo;
- tres fichas interiores por perfil;
- diseño responsive sin JavaScript;
- navegación local y recursos autocontenidos;
- disclosure permanente y contacto desactivado.

## Límite actual

La diferenciación principal ya existe en copy, dirección cromática y énfasis de la experiencia. La siguiente iteración debe ampliar la diferencia estructural con componentes específicos por vertical, por ejemplo buscador y filtros reales para catálogo, cronología de proyecto para desarrolladoras y calculadora guiada para tasación. Esos componentes solo deben activarse cuando sus datos y reglas estén definidos en contratos.

## Paso hacia un negocio real

Antes de sustituir los fixtures se necesita autorización del propietario y una carga controlada de identidad, servicios, zonas, inventario, fotografías y contacto. Cada dato debe registrar fuente, derechos y estado de verificación. La publicación, indexación, formularios y dominio permanecen bloqueados hasta completar esa revisión.
