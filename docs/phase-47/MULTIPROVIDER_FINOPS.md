# Fase 47 — FinOps y capacidad multiproveedor

La fase 47 convierte coste y capacidad en decisiones auditables antes de escalar la flota. Implementa asignación por tenant, presupuesto por cohorte, forecast determinista, capacidad conjunta, simulación de picos, arbitraje ponderado y límites automáticos simulados.

## Escenarios

- **Cohorte base:** 1.200 unidades previstas, presupuesto dentro del límite, 108,33% de margen y pico 1,2× atendido.
- **Cohorte de pico:** 2.700 unidades previstas, presupuesto excedido, −22,22% de margen y pico 1,5× con 1.950 unidades sin capacidad.
- En ambos escenarios hay dos proveedores y dos tenants sintéticos. Los identificadores de tenant se almacenan como fingerprints.

## Seguridad operativa

- Cero compras y cero cambios de proveedor.
- Arbitraje `dry_run` y límites en modo `simulation`.
- Panel privado, local y `noindex`.
- Roles separados para coste, finanzas, capacidad, resiliencia, arbitraje, límites y auditoría.

## Ejecución

```sh
npm test
npm run build
npm run start:finops
```

Abrir `http://127.0.0.1:4221/`.
