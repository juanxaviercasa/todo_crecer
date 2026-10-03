# ADR-055 — FinOps y capacidad multiproveedor

## Decisión

Cada cohorte debe poder atribuir costes a tenants pseudonimizados, proyectar demanda a 90 días, comparar el forecast con presupuesto y capacidad, ensayar picos y producir una recomendación de proveedor explicable.

El arbitraje usa coste, capacidad y fiabilidad. Solo considera proveedores elegibles y registra una recomendación en modo `dry_run`; nunca cambia rutas, contrata capacidad ni autoriza compras.

## Límites automáticos

La fase calcula límites blandos y duros sobre la capacidad disponible. Las acciones `throttle_simulated` y `block_simulated` describen el resultado esperado, pero no afectan tráfico real.

## Gate real

La ejecución requiere exportes reales de facturación, aprobación financiera, evidencia vigente del proveedor y autorización explícita para cualquier cambio. La simulación completa no satisface ese gate.
