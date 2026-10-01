# Fase 10: experiencias inmobiliarias diferenciadas

## Principio

Una familia visual no es suficiente para producir valor. La página debe ayudar al visitante a completar la decisión propia de ese negocio. Fase 10 introduce un modelo estructurado entre el arquetipo y el HTML.

`buildExperience(profile, catalog)` crea un documento validado y `renderExperience(model, catalog)` rechaza referencias que no existan en el catálogo sintético. El renderer solo incorpora el módulo después de validar el perfil completo mediante los gates anteriores.

## Módulos

| Arquetipo | Módulo | Tarea principal |
|---|---|---|
| Catálogo amplio | `catalog_search` | Reducir opciones con filtros comprensibles |
| Desarrolladora | `project_timeline` | Entender etapas y verificaciones pendientes |
| Asesor boutique | `advisory_path` | Preparar una conversación según el momento del cliente |
| Proyectos y lotes | `lot_comparison` | Comparar legalidad, servicios, etapa y acceso |
| Tasación | `valuation_brief` | Preparar contexto para una valoración humana |

## Seguridad de la demo

Los botones están desactivados, no existen formularios y la política CSP prohíbe scripts, conexiones y acciones de formulario. La acción principal explica que el contacto se habilitará únicamente para un negocio autorizado.

## Integración siguiente

Para activar interacción se necesitará un contrato de sesión, consentimiento, minimización de campos, anti-spam, retención y destino del lead. La búsqueda deberá operar solo sobre inventario autorizado y `web_ready`. La cronología y comparación requerirán procedencia por campo.
