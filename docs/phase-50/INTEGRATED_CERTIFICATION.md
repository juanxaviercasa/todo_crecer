# Fase 50 — certificación integrada y ensayo end-to-end

Esta fase comprueba el sistema como una unidad. Inventaría diez módulos críticos, verifica sus dependencias, valida contratos, recorre diez etapas de un negocio y sella cada checkpoint en una cadena de evidencia.

## Resultado del ensayo

- 10/10 módulos críticos presentes.
- 430 contratos previstos después de incorporar esta fase.
- 10/10 pasos del recorrido completados localmente.
- Recuperación con RTO 18/30 minutos y RPO 5/15 minutos.
- Dossier con 100% de estructura y 0% de evidencia real.
- Decisión: `no_go_production`.
- Siguiente gate: `supervised_real_business_intake`.

## Ejecución

```sh
npm test
npm run build
npm run start:certification
```

Abrir `http://127.0.0.1:4224/`.
