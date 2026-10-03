# Fase 44 — canary de proveedor

La fase 44 valida la progresión controlada de un proveedor antes de cualquier activación real. Usa únicamente metadatos sintéticos y cubre dos caminos: canary sano hasta 100% y degradación al 25% con rollback automático.

## Controles

- Etapas 5%, 25%, 50% y 100% en orden obligatorio.
- Baseline de 1.000 objetos y tolerancia de discrepancias igual a cero.
- Disponibilidad mínima 99,9%, latencia p95 máxima 800 ms y error máximo 1%.
- Presupuesto esperado 900 centavos y límite duro 2.500.
- Aprobaciones de seguridad y plataforma; el creador no puede autoaprobarse.
- Cero escrituras, publicaciones y cambios externos.

## Ejecución

```sh
npm test
npm run build
npm run start:provider-canary
```

Abrir `http://127.0.0.1:4218/`.
