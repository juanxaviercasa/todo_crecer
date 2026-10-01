# Validación de Fase 1

Resultado de esta entrega: **PASS en el alcance automatizado definido**.

| Prueba | Resultado |
|---|---|
| Contratos originales y nuevos de Phase 0 | 13 esquemas válidos |
| Ejemplos de Phase 0 | 13 válidos y 26 casos inválidos rechazados |
| Pruebas de motor, gates y servidor | 25/25 aprobadas |
| Build real | HTML/CSS generados; hashes y tamaños verificados |
| Navegador Chrome | 9 grupos de comprobaciones aprobados |
| Anchos 1440, 768, 390 y 320 px | Sin desbordamiento horizontal |
| Navegación y teclado | Anclas válidas, clics y skip-link verificados |
| Axe, reglas WCAG A/AA seleccionadas | 0 infracciones detectadas; 1 regla incompleta |
| Consola y red del sitio | 0 errores de navegador; 0 solicitudes externas |
| Publicación | not_published |

El informe reproducible y la versión exacta del navegador están bajo
`dist/<site>/<build>/qa/<fecha>/report.json`. Las capturas desktop.png y mobile.png
corresponden a ese mismo build y fueron inspeccionadas visualmente.

La regla incompleta es color-contrast sobre elementos decorativos con gradiente y
un símbolo de navegación. Requiere revisión manual; no se cuenta como contraste
certificado. Las pruebas no acreditan conformidad WCAG completa, calidad comercial,
seguridad completa, lector de pantalla o comportamiento en otros navegadores.

El componente services se probó mediante generación y validación en los tests del
motor; este Golden Business de navegador contiene hero y about. Las variantes
visuales adicionales y los casos de diez negocios son la siguiente fase.

El informe de Phase 0 permanece como registro de su alcance anterior: allí se
validaba una muestra HTML escrita a mano. El SiteSnapshot real está en dist; no
confundirlo con `examples/golden-business/site-snapshot.json`.
