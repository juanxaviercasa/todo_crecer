# Guía del adaptador Cloudflare

## Configuración

Cloudflare recomienda `wrangler.jsonc` para proyectos nuevos y permite ambientes nombrados. La plantilla de esta fase declara D1, R2, Queue, service binding, Secrets Store y observabilidad bajo `env.staging`.

Los bindings actúan como capacidades. Para comunicación interna, el Worker del control plane debe usar un service binding hacia el Worker de identidad, sin exponerlo en una URL pública. El contexto de Access no se propaga automáticamente entre Workers, por lo que el servicio receptor debe validar su propia identidad y autorización.

Secrets Store se referencia mediante binding y `get()` asíncrono. El código y el plan no deben contener el valor. El despliegue del binding requiere permisos específicos y scope `workers`.

## Activación futura

1. Sustituir todos los placeholders en un archivo no versionado.
2. Crear un token CI con permisos mínimos y guardarlo en el secret store del pipeline.
3. Ejecutar sólo preflight e inventario de lectura.
4. Revisar recursos, coste, dominios y plan digest.
5. Habilitar el adaptador de staging mediante una operación privilegiada aprobada.
6. Ejecutar apply, smoke y rollback sobre datos sintéticos.
7. Replicar auditoría fuera del control plane.

La plantilla no debe ejecutarse directamente desde esta entrega.
