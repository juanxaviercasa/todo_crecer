# Fase 42 — evidencia y decisión reversible

La fase 42 prepara el momento en que exista un proveedor candidato real. El operador puede entregar evidencias sanitizadas de términos, residencia, cifrado, ciclo de vida y coste. Legal y compras revisan por separado; una sesión de lectura verifica el alcance y la ausencia de escrituras. Una decisión aprobada siempre tiene un plan dry-run de reversión.

## Rehearsal actual

- Dos candidatos sintéticos.
- Diez entregas sanitizadas, sin valores crudos.
- Dos revisiones legales y dos de compras.
- Dos sesiones de metadatos, cero escrituras.
- Evidencia real: 0.
- Selección: ninguna.
- Publicaciones, mensajes y cambios externos: 0.

## Ejecución

```sh
npm test
npm run build
npm run start:evidence-gate
```

Abrir `http://127.0.0.1:4216/`. La interfaz es privada, `noindex` y rechaza escrituras y traversal.
