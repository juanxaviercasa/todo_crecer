# Fase 6 — generador de demos privadas

## Cadena exigida

```text
OwnerSubmission confirmado
          ↓ transformación determinista
BusinessTruth
          ↓ identidad exacta
OperatorReview aprobado y vigente
          ↓ private-demo gate
PrivateDemoBuild noindex / not_published
```

`authorize()` comprueba el esquema de los tres artefactos, vuelve a calcular el hash del expediente, regenera BusinessTruth y compara su hash, verifica la decisión y rechaza cualquier capacidad pública.

## Separación de motores

El Site Engine de las primeras fases conserva su allowlist exclusivamente sintética. No se modificó para aceptar fuentes reales. `packages/private-demo/` implementa una compuerta separada para fuentes `owner` con derechos `needs_review` y exige el OperatorReview.

Esto evita que una ampliación destinada a un piloto autorizado reduzca la seguridad de las demos masivas sintéticas.

## Salida

Cada build vive en un directorio identificado por un hash y contiene:

- portada profesional privada;
- página de trazabilidad;
- estilos locales;
- imagen conceptual sintética;
- `private-demo-build.json` con hashes y artefactos.

El manifiesto fija `mode: private_demo`, `indexing: noindex`, `publication.status: not_published` y `publication.url: null`.

## Contenido y contacto

La demo muestra nombre, descripción, cliente ideal, especialidad, zonas, servicios y canal declarado. El contacto se presenta como texto de revisión, sin enlace, formulario ni envío. Las fotografías definitivas siguen pendientes de carga y derechos.

## Siguiente límite

Antes de recibir información real en Internet hacen falta autenticación, almacenamiento privado, cifrado, control de acceso, retención, eliminación y registro persistente. Después podrá ejecutarse el primer piloto con un propietario autorizado.
