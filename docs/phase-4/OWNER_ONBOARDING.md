# Fase 4 — onboarding verificable del propietario

## Objetivo

El onboarding convierte una conversación informal en un expediente estructurado. Separa tres decisiones:

1. El propietario confirma que puede representar el negocio y que los datos son correctos.
2. HazloCrecer revisa coherencia, evidencia, contacto y derechos de activos.
3. Un proceso de publicación posterior decide si una demo puede hacerse pública e indexable.

Ninguna declaración del propietario salta directamente al paso 3.

## Datos recogidos

| Grupo | Contenido | Uso previsto |
|---|---|---|
| Identidad | Nombre público, categoría, rol y razón social opcional | Presentación y revisión interna |
| Enfoque | Descripción, cliente ideal, especialidad y acción principal | Estrategia y composición |
| Oferta | Zonas y servicios | Contenido verificable |
| Contacto | Canal público declarado | Activación posterior |
| Activos | Tipo, referencia, relación y permiso | Revisión de derechos |
| Declaraciones | Representación, veracidad, contacto y derechos | Trazabilidad de consentimiento |

El fixture incluido es completamente ficticio. La interfaz no envía información a un servidor y no tiene una acción de formulario remota.

## Estados y bloqueos

- `draft`: puede estar incompleto.
- `submitted`: entregado, sin confirmación final.
- `owner_confirmed`: las cuatro declaraciones y la fecha son obligatorias.
- `needs_changes`: requiere correcciones.
- `rejected`: no debe continuar.

`readiness()` comprueba confirmación, declaraciones, zonas, oferta, coherencia del contacto y derechos de activos. Si todo pasa, devuelve `ready_for_human_review` y permite preparar una demo privada. Siempre devuelve `may_publish: false` y `may_index: false`.

## Transformación a BusinessTruth

`toBusinessTruth()` produce:

- una fuente `owner` con derechos `needs_review`;
- provenance `owner_verified` por cada hecho transformado;
- servicios declarados con estado `owner_verified`;
- política de demo privada, noindex y revisión humana obligatoria.

El Site Engine sintético existente rechaza estas fuentes reales por diseño. La siguiente fase debe introducir un review gate independiente que apruebe una instantánea concreta y jamás relaje el gate sintético global.

## Privacidad y operación futura

La versión actual no debe usarse aún para recopilar información real por Internet. Antes de desplegarla hacen falta autenticación, cifrado en tránsito y reposo, política de retención, control de acceso, almacenamiento privado de activos, registro de cambios y eliminación a solicitud.
