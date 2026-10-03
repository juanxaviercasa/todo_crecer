# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 38

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 38 permite validar la integración antes de disponer de proveedores: contrato portable, adaptador de referencia, 13 vectores adversariales, evidencia sanitizada, replay determinista, riesgos y certificado de simulación.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:adapter-certification
```

Abrir http://127.0.0.1:4212/.

## Estado comprobado

- 305 contratos JSON Schema.
- 1.272 pruebas aprobadas y 0 fallidas.
- 59 pruebas específicas de la fase 38.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- Contrato portable v1.0.0 con 6 operaciones read-only.
- 13 vectores adversariales aprobados.
- 8 riesgos controlados.
- Evidencia sanitizada con replay determinista y score 100.
- Certificado de simulación válido por 30 días.
- 0 proveedores reales seleccionados.
- 0 secretos, 0 escrituras, 0 conexiones externas y 0 publicaciones.

## Gate real

El sistema y el adaptador de referencia están validados sin proveedor. Un candidato real deberá implementar el contrato, superar los mismos 13 vectores, aportar evidencia read-only sanitizada y pasar revisión legal y de compras. El certificado de simulación no selecciona producción.

## Fase 39 recomendada

**Sala de incorporación y decisión de candidatos.** Implementar expedientes con placeholders para proveedores reales, solicitudes de evidencia, caducidad y renovación, revisión legal, seguridad, finanzas y compras, comparador de términos y un gate de selección. La sala debe aceptar datos parciales desde ahora y mantener bloqueada la decisión final mientras falte cualquier evidencia real obligatoria.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
