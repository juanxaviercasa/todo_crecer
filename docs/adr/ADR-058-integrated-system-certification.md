# ADR-058 — Certificación integrada del sistema

## Decisión

La plataforma se certifica mediante un inventario de módulos críticos, un grafo acíclico de dependencias, validación offline de contratos, un recorrido end-to-end y evidencia encadenada por hashes.

La certificación estructural y la autorización productiva son estados distintos. Un ensayo puede quedar certificado aunque la decisión sea `no_go_production` por falta de evidencia real.

## Gate

La producción requiere consentimiento del propietario, Business Truth real, derechos de activos, revisión legal, aprobación de proveedor y autorización operativa. Ningún resultado sintético sustituye estos elementos.
