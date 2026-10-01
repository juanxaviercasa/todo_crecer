# CI gate de staging

El workflow de ejemplo divide discovery, plan, apply y verify. Apply usa el environment `staging`, depende del plan y está desactivado mediante `if: false`.

Los únicos valores externos aparecen como referencias a GitHub Secrets. El workflow no contiene tokens, IDs ni claves. La política limita branch, ambiente, permisos y TTL esperado.

Cloudflare indica que Wrangler en CI no interactivo necesita API token y account ID. El token debe limitarse a la cuenta y permisos necesarios. Esta entrega no crea ni almacena ese token.

Antes de habilitar apply se debe reemplazar el paso de texto por un comando que consuma el plan firmado, verificar el digest dentro del job y mantener la aprobación del environment.
