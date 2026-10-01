# Perfil Cloudflare preparado, sin despliegue

Esta carpeta traduce los puertos de infraestructura a recursos concretos:

- Cloudflare Access para el perímetro de administración; el Worker debe validar la identidad recibida y resolverla contra `principals` y `tenant_memberships`.
- D1 para metadatos transaccionales, membresías, estados y referencias a objetos.
- R2 privado para sobres cifrados, originales en cuarentena y variantes liberadas.
- Workers Secrets para claves activas; la rotación debe mantener un identificador de versión de clave.
- Queues para análisis, generación de variantes y tareas de retención.
- Un adaptador externo pendiente para análisis antimalware.

`wrangler.example.jsonc` usa placeholders deliberados. No debe desplegarse hasta crear los recursos, sustituir los identificadores y superar el informe de preparación. `.dev.vars.example` contiene nombres y marcadores, nunca secretos reales.

La migración conserva únicamente metadatos y referencias. Los cuerpos privados deben permanecer cifrados en R2. La publicación continúa bloqueada incluso si todas las variables existen; requiere una fase posterior de despliegue, seguridad y aprobación humana.
