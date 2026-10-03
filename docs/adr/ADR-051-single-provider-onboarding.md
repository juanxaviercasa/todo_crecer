# ADR-051 — Incorporación de un único proveedor

## Decisión

La primera incorporación se limita a un candidato y empieza con un manifiesto sanitizado en cuarentena. Seguridad valida esquema, secretos, datos personales y vigencia. Legal y compras cierran revisiones independientes. Una sesión con alcance `metadata_read` debe demostrar cero escrituras antes de registrar autorización humana.

## Aplicación

La autorización es reversible, queda ligada al digest del manifiesto y no habilita `apply`. La ventana de cambio declara el freeze, pero mantiene `apply_allowed: false`. Un checkpoint de rollback conserva el origen, permite revocar el destino y verifica integridad.

## Estado actual

El expediente incluido es sintético. Los cierres son condicionales, la sesión es ensayada y no se selecciona candidato. La incorporación real requiere evidencia real y aprobación humana explícita en una fase posterior.
