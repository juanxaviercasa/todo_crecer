# Fase 15 — Claim, perfiles técnicos y capacidades

## Claim

El propietario crea un expediente y aporta al menos dos tipos de evidencia. Ejemplos admitidos: control de dominio, email empresarial, documento oficial, callback, invitación de un propietario previo o revisión presencial.

El contrato conserva hashes y decisiones. Los archivos deben permanecer en la bóveda de activos, sujetos a cuarentena, derechos y retención. El solicitante no puede revisar su propia evidencia.

## Perfiles técnicos

`commerce/plans.json` contiene dos perfiles en borrador para probar el motor. No son ofertas comerciales. No tienen precios ni se pueden activar desde un adaptador productivo.

## Estado comercial

Los eventos externos deben pasar por un adaptador que verifique autenticidad, normalice el payload y produzca `BillingNormalizedEvent`. El núcleo aplica idempotencia, orden temporal y una máquina de estados cerrada.

`createUnconfiguredBillingAdapter` falla de forma segura. `createLocalBillingAdapter` acepta exclusivamente eventos marcados como sintéticos.

## Derivación

El snapshot enumera todas las capacidades conocidas. Para cada una devuelve `allowed`, límite y motivo. Las capacidades comerciales exigen claim verificado y estado `active` o `trialing` vigente. Los grants manuales caducan en un máximo de 31 días.

Revocar el claim elimina las capacidades comerciales en el siguiente cálculo, aunque la suscripción siga activa.
