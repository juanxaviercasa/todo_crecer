# Golden Business sintético

Leer en este orden: business-truth.json, vertical-recipe.json, brand-profile.json,
site-config.json, site-snapshot.json y agent-output.json; después los eventos.
`agent-output.failed.json` es otro escenario simulado, no una ejecución real fallida.

Todo el negocio es ficticio. Los timestamps, IDs y ejecuciones son datos de prueba.
La fuente interna permite comprobar procedencia sin inventar información del usuario.
Abrir `snapshot/index.html` muestra una demostración local mínima sin contactos ni
formularios. No es el futuro motor de sitios. No se han ejecutado agentes de IA.

Validar desde la raíz con `npm test`. No editar hashes manualmente sin recalcular
SHA-256 de los bytes UTF-8 exactos de los archivos fuente y propagar los cambios a
todos los consumidores. Consultar `docs/phase-0/CONTRACTS.md`.
