# Operaciones privilegiadas

## Estados

`pending → approved → executed` es el camino permitido. También existen `rejected`, `expired` y `cancelled`.

## Separación de funciones

- Riesgo alto: un aprobador independiente.
- Riesgo crítico: dos aprobadores distintos.
- El solicitante no puede aprobar.
- Ningún solicitante o aprobador puede ejecutar.
- La solicitud expira y no se reactiva.

El ejecutor recibe únicamente capability, resource y operation id. El resultado se resume mediante digest en la auditoría para evitar registrar secretos o payloads sensibles.

## Artefactos

Un despliegue debe presentar una attestation válida para el digest del artefacto y su manifiesto. Cambiar cualquiera de los dos invalida la verificación. La promoción a staging deberá rechazar artefactos sin firma o firmados por una clave retirada.
