# Fase 46 — gobierno continuo del proveedor

La fase 46 añade el ciclo operativo que comienza después del hipercuidado. Evalúa seis dimensiones, renueva cinco evidencias, revisa SLA y coste, rota credenciales, registra cambios y mantiene un plan de sustitución.

## Escenarios ensayados

- Ciclo sano: score 95, evidencia vigente, SLA cumplido, coste dentro del presupuesto y plan de sustitución en standby.
- Ciclo degradado: score inferior a 75, dos evidencias vencidas, tres brechas de SLA y sobrecoste; resultado `replacement_review`.
- Ambos ciclos tienen rotación simulada, siete eventos auditados y cero operaciones externas.

## Ejecución

```sh
npm test
npm run build
npm run start:provider-governance
```

Abrir `http://127.0.0.1:4220/`.
