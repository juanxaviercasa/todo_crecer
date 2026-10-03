# Fase 47 — validación local

## Resultado

- Contratos validados: **400**.
- Pruebas base: **1.376 aprobadas, 0 fallidas**.
- Pruebas específicas de la fase 47: **26 aprobadas, 0 fallidas**.
- Suite acumulada ejecutada: **1.508 aprobadas, 0 fallidas**.
- Build acumulado: aprobado.
- Vulnerabilidades de producción: **0**.
- Patrones de credenciales detectados: **0**.
- Compras, cambios de proveedor, conexiones externas y publicaciones: **0**.

## Invariantes

- La suma de costes por tenant coincide con sus proveedores y costes compartidos.
- El presupuesto distingue `within_budget`, `at_risk` y `exceeded`.
- La capacidad descuenta reservas y solo suma proveedores elegibles.
- La demanda no atendida se conserva como `shed_units`.
- El arbitraje no autoriza cambios.
- Los límites no se aplican fuera de la simulación.
- Compras, cambios externos y publicaciones permanecen en cero.
