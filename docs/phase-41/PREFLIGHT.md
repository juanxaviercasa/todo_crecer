# Fase 41 — preflight de salida en solo lectura

La fase 41 convierte la recomendación de salida de fase 40 en un flujo operativo que se puede ensayar antes de disponer de proveedores reales. Registra dos candidatos sintéticos, abre sesiones de metadatos, ejecuta sondas sin escritura, coteja residencia y cifrado, revisa ciclo de vida y rotación, calcula el coste y sella un dossier comparativo.

## Estado del ensayo

- Dos candidatos sintéticos, sin identidad comercial real.
- Dos sesiones con alcance `metadata_read` y credenciales representadas por huella.
- Doce lecturas simuladas y cero escrituras.
- Términos reales, compras y autorización humana permanecen pendientes.
- No se selecciona proveedor mientras los términos sean placeholders.
- `apply` falla cerrado con `EXTERNAL_CHANGE_BLOCKED`.

## Ejecución local

```sh
npm test
npm run build
npm run start:preflight
```

Abrir `http://127.0.0.1:4215/`. La interfaz es privada, `noindex` y no tiene formularios remotos.
