# Promoción, smoke tests y rollback

## Promoción

La promoción vincula artefacto, manifiesto, attestation, release origen y release destino. Los digests deben coincidir exactamente con la attestation verificada. El creador no puede aprobar su promoción.

## Smoke suite

Los diez controles son:

1. Health.
2. Digest del artefacto.
3. Security headers.
4. `noindex`.
5. Identidad autorizada.
6. Identidad denegada.
7. Roundtrip de base.
8. Roundtrip de objetos.
9. Roundtrip de cola.
10. Cadena de auditoría.

Todos deben aprobar. Una falla bloquea la promoción.

## Rollback

El rollback restaura un release firmado anterior, limita la purga de caché, repite smoke tests y verifica auditoría. Requiere creador, aprobador y ejecutor independientes. El ensayo lo ejecuta incluso después de una promoción sana para probar el camino de recuperación.
