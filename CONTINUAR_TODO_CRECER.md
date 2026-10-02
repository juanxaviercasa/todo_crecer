# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 34

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todo_crecer-repo`.

La fase 34 implementa el motor privado que clasifica, minimiza, cifra y revisa evidencia antes de sustituir los fixtures del expediente campo por campo.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:evidence
```

Abrir http://127.0.0.1:4208/.

## Estado comprobado

- 262 contratos JSON Schema.
- 1.038 pruebas aprobadas y 0 fallidas.
- 63 pruebas específicas de la fase 34.
- 0 vulnerabilidades de producción y 0 secretos detectados.
- 1 expediente sintético privado.
- 4 campos innecesarios redactados.
- 7 campos permitidos cifrados y sustituidos en simulación.
- 2 revisores independientes.
- 18 eventos en una cadena de custodia válida.
- 0 claves persistidas, 0 reemplazos reales y 0 publicaciones.

## Gate real

El ensayo está completo. Para procesar evidencia real aún se requiere una fuente verificada del propietario, infraestructura externa de gestión de claves y los controles operativos de producción. Un paquete privado real tampoco autoriza publicación automáticamente.

## Fase 35 recomendada

**Bóveda operativa y ciclo de vida de evidencia.** Implementar adaptadores para un gestor externo de claves y almacenamiento cifrado, acceso temporal, descarga con marca, revocación, destrucción verificable, recuperación ante fallos y auditoría del ciclo completo. Todo se ensayará con adaptadores locales antes de conectar servicios reales.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
