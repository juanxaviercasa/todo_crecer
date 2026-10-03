# Migración, canary y rollback

El dry-run divide mil objetos sintéticos en diez lotes, enlaza sus digests y no ejecuta escrituras externas. El canary propone 1%, 5%, 25% y 100%. Cada etapa requiere integridad, latencia, errores y coste aceptables. El rollback congela escrituras, restaura routing, verifica digests y revoca la sesión.
