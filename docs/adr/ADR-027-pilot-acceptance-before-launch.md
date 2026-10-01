# ADR-027: aceptación del piloto antes del lanzamiento

## Estado

Aceptado para la Fase 19.

## Decisión

Un piloto solo puede producir un paquete local sellado cuando nueve requisitos tienen evidencia, cuatro áreas reciben revisión independiente, el propietario acepta siete alcances sobre la misma revisión y un ensayo local termina sin fallos.

Cada decisión guarda el hash del expediente. Una modificación posterior cambia ese hash y vuelve obsoletas las decisiones anteriores. El creador del expediente no puede aprobarlo y el propietario solo puede aceptar el tenant al que pertenece.

El paquete resultante tiene `may_publish: false`. Es evidencia de preparación y no una autorización de despliegue, un contrato ni una firma electrónica.

## Consecuencias

- El estado “listo” se calcula y explica; no se declara manualmente.
- Un bloqueo conserva su código y evidencia faltante.
- La aceptación del propietario no corrige revisiones técnicas ausentes.
- El ensayo no llama proveedores ni modifica DNS.
- Producción necesita una decisión posterior, credenciales, recursos configurados y autorización específica.
