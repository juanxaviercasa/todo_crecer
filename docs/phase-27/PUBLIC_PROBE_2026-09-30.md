# Evidencia pública — 2026-09-30

Consulta DNS y HTTPS de sólo lectura. No se usaron credenciales ni APIs privadas.

| Hostname | DNS A | HTTPS | Resultado |
|---|---:|---:|---|
| `guialima.online` | No resuelto desde este entorno | No accesible | Bloqueado para staging público |
| `hazlo-crecer.pages.dev` | Sí | 200 | Disponible en Cloudflare Pages |
| `todolima.com` | Sí | 200, redirige a `www.todolima.com` | Disponible |
| `hazlocrecer.com` | Sí | 200 | Disponible |

Los tres hosts accesibles respondieron con `server: cloudflare`. La respuesta principal no incluyó `Content-Security-Policy`, `X-Frame-Options` ni `X-Robots-Tag`. Esto no demuestra que todas las rutas carezcan de esas cabeceras, pero sí justifica incluirlas en el smoke test del futuro hostname de staging.

`guialima.online` debe resolver y servir TLS antes de cualquier promoción real bajo ese dominio.
