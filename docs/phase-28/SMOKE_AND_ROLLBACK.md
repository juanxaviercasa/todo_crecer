# Smoke y rollback

La suite es cerrada y contiene: DNS, TLS, CSP, `X-Frame-Options`, `X-Robots-Tag`, ruta Worker, binding D1, binding R2, entrega Queue, binding de secretos, noindex y rollback probe.

Cada observación conserva resultado y digest de evidencia. No almacena respuestas privadas. Un fallo marca la suite como fallida y debe detener la promoción.

El rollback suspende la ruta nueva, restaura el artefacto anterior y verifica la versión previa. Lo prepara un operador, lo aprueba una persona independiente y lo ejecuta un rol executor.
