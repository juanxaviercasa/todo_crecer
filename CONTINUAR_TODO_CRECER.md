# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 37

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 37 implementa un laboratorio neutral para comparar combinaciones de object storage y KMS mediante residencia, cifrado, lifecycle, rotación, observabilidad y coste. Todas las evidencias actuales son fixtures sintéticos.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:provider-lab
```

Abrir http://127.0.0.1:4211/.

## Estado comprobado

- 293 contratos JSON Schema.
- 1.213 pruebas aprobadas y 0 fallidas.
- 58 pruebas específicas de la fase 37.
- 0 vulnerabilidades de producción y 0 patrones de credenciales detectados.
- 2 candidatos sintéticos comparados.
- 12 probes y 12 assessments ejecutados.
- 2 sesiones efímeras cerradas con alcance exclusivo `metadata.read`.
- 1 candidato elegible con 100/100 y 1 rechazado por controles obligatorios.
- Informe comparativo sellado.
- 0 secretos, 0 escrituras, 0 conexiones externas y 0 publicaciones.

## Gate real

El laboratorio permite preparar una sesión externa de solo lectura. Las escrituras permanecen bloqueadas hasta obtener evidencia real, revisar términos contractuales y recibir aprobación humana de compras. Ningún fixture autoriza una decisión comercial.

## Fase 38 recomendada

**Sala de decisión de proveedores y puente al preflight real.** Crear manifiestos para candidatos reales, un kit de adaptador verificable, importación sanitizada de evidencia read-only, snapshots de términos y costes, matriz de riesgos, caducidad de evidencias y un paquete de aprobación de compras. Debe poder trabajar inicialmente con placeholders y bloquear la selección definitiva mientras falten fuentes y sesiones reales.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
