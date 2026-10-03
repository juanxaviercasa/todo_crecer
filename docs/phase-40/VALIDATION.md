# Fase 40 — validación local

Fecha de validación: 2026-10-03.

## Resultado

- `npm test`: **1.376 pruebas aprobadas, 0 fallidas**.
- Contratos JSON Schema: **337**.
- Ejemplos válidos: 13; pruebas negativas: 26; validación cruzada aprobada.
- Pruebas específicas de fase 40: **46 aprobadas**.
- Build del ensayo de salida: completado.
- Objetos ensayados: 1.000; reenvolturas: 1.000; integridad: aprobada.
- RTO objetivo 30 min / medido 12 min; RPO objetivo 15 min / medido 0 min.
- Coste simulado: 1.700 centavos; límite duro: 5.000; decisión: allow.
- Failover y rollback: aprobados.
- Destrucción en origen: simulada y verificada; cambios externos: 0.
- Secretos persistidos: 0; conexiones externas: 0; publicaciones: 0; escrituras: 0.

## Interpretación

La fase demuestra una salida reversible entre dos adaptadores simulados, con formato neutral, claves reenvueltas sin exponer plaintext, comprobación de integridad y control de coste. No autoriza migración real: `real_provider_execution` y `human_exit_authorization` permanecen bloqueados hasta obtener proveedores, términos, evidencias y autorización humana.

## Repetición

```sh
npm test
npm run build
npm run start:portability
```

Abrir `http://127.0.0.1:4214/` durante la sesión local.
