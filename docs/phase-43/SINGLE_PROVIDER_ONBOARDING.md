# Fase 43 — incorporación controlada de un proveedor

Esta fase prepara una ceremonia segura para el primer proveedor real sin afirmar que ya existe. Solo un manifiesto puede entrar al flujo. El manifiesto se representa mediante huellas y digests; no contiene identificadores crudos, secretos ni datos personales.

## Flujo

1. Recepción del manifiesto sanitizado.
2. Cuarentena y cuatro controles automáticos.
3. Cierre independiente de legal y compras.
4. Verificación read-only con cero escrituras.
5. Autorización humana reversible ligada al digest.
6. Ventana de cambio con apply bloqueado.
7. Checkpoint y rehearsal de rollback.
8. Sellado del dossier y cálculo de readiness.

## Ejecución local

```sh
npm test
npm run build
npm run start:provider-onboarding
```

Abrir `http://127.0.0.1:4217/`.
