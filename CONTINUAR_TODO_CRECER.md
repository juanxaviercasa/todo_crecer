# TodoLima / HazloCrecer — estado y próximos pasos

## Fase actual: 31

Ubicación de trabajo: `C:\Users\pc\Videos\todo_crecer\todolima-platform-phase31`.

La fase 31 incorpora un laboratorio de propietarios sintéticos. Permite probar el recorrido completo y la fricción sin contactar a ninguna empresa ni presentar datos inventados como reales.

## Ejecutar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run start:simulation
```

Abrir http://127.0.0.1:4205/.

## Estado comprobado

- 225 contratos JSON Schema.
- 866 pruebas aprobadas y 0 fallidas.
- 50 pruebas específicas de simulación.
- 0 vulnerabilidades de producción y 0 secretos detectados.
- 5 propietarios sintéticos y 5 escenarios.
- 11 mensajes internos de sandbox y 2 recordatorios simulados.
- 0 contactos reales, 0 entregas externas y 0 publicaciones.

## Escenarios cubiertos

1. Respuesta rápida y aceptación completa.
2. Silencio: espera, dos recordatorios y cierre respetuoso a las 96 horas.
3. Preguntas de privacidad derivadas a una persona.
4. Activos o derechos incompletos devueltos para corrección.
5. Rechazo registrado sin insistencia posterior.

## Fase 32 recomendada

**Piloto asistido con un único negocio real.** Preparar un paquete final para un candidato: canal y destinatario verificados por una persona, mensaje exacto, hoja de conversación, respuestas a preguntas frecuentes, enlace privado de consentimiento, formulario de entrevista y carpeta segura de activos. La salida permanecerá bloqueada hasta recibir una instrucción explícita para ese destinatario concreto.

## Dominios previstos

- `todolima.com`: descubrimiento y directorio.
- `hazlocrecer.com`: propuesta comercial y captación.
- `hazlo-crecer.pages.dev`: referencia provisional.
- `guialima.online`: demos y subdominios gestionados.
- `hazlocrecer.es`, `hazlocrecer.info` y `hazlocrecer.store`: disponibles.
