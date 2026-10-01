# Fase 5 — review gate interno

## Propósito

El review gate convierte la revisión humana en un artefacto verificable. Evita que “aprobado” sea un estado mutable sin contexto y responde cuatro preguntas:

1. ¿Qué versión exacta del expediente se revisó?
2. ¿Qué controles pasaron o fallaron?
3. ¿Quién tomó la decisión y cuándo?
4. ¿Qué capacidad concreta concedió la decisión?

## Decisiones

| Decisión | Demo privada | Publicación | Indexación |
|---|---:|---:|---:|
| `approved_private_demo` | Sí | No | No |
| `changes_requested` | No | No | No |
| `rejected` | No | No | No |

El contrato impide aprobar con controles fallidos o motivos de rechazo. Solicitar cambios y rechazar exige al menos un `reason_code`.

## Controles

La inspección reutiliza los requisitos del onboarding y añade dos controles del operador:

- confirmación del representante;
- declaraciones completas;
- zona de servicio;
- oferta declarada;
- coherencia del contacto;
- derechos de activos;
- detección de negocio duplicado;
- revisión de afirmaciones sensibles.

Los dos últimos son marcadores sintéticos en esta versión. En producción deben consultar un índice interno y reglas editoriales versionadas.

## Vinculación y obsolescencia

El registro almacena `submission_hash`, calculado sobre una serialización estable del expediente. `verifyBinding()` vuelve a calcularlo antes de usar la aprobación. Un cambio de contenido produce `REVIEW_STALE` y obliga a revisar nuevamente.

## Interfaz

La bandeja incluye tres estados ficticios, resumen del negocio, evidencia, hash, checklist, nota interna y tres decisiones. Todo opera en memoria y puede descargar el registro JSON. El servidor es local, de solo lectura y bloquea conexiones externas.

## Siguiente integración

La fase siguiente debe crear un generador de demo privada que exija simultáneamente OwnerSubmission, BusinessTruth y OperatorReview vigentes. Esa etapa debe seguir separada del permiso de publicación pública.
