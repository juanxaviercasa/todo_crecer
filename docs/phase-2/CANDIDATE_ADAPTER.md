# Adaptador de candidatos y piloto sintético

El adaptador recibe una definición compacta de perfil y genera BusinessTruth, VerticalRecipe, BrandProfile y SiteConfig válidos. Cada documento conserva fuentes `urn:todolima:fixture:*`, hashes y referencias propias. El motor sigue rechazando fuentes reales, publicación, hostnames externos e integraciones.

Cinco perfiles fueron generados: catálogo amplio, desarrollador de proyectos, asesor boutique, proyectos/lotes y tasación para propietarios. Sus nombres y contenidos son ficticios. Masterhouse, LIMAin, Abad, DSI y Lago & Alva se usaron únicamente para identificar requisitos faltantes en el producto.

Validación realizada el 2026-09-30:

- 13 schemas y 13 ejemplos contractuales válidos.
- 26 pruebas negativas contractuales.
- 27 pruebas del motor y el adaptador aprobadas.
- Cinco builds con business_id, site_id, hashes y directorios aislados.
- Indexación `noindex` y publicación `not_published` en los cinco.
- Índice y perfil Brava Residencial observados en navegador local.

La interfaz generada por el motor continúa siendo informativa y básica. La siguiente fase técnica debe incorporar las composiciones del piloto visual 0.5.0 como componentes seguros del motor.
