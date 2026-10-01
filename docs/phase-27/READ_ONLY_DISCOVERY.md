# Discovery de sólo lectura

## Sesión

El token se verifica mediante `/user/tokens/verify`. La sesión read dura como máximo una hora; el CLI usa quince minutos. Sólo se persisten fingerprints de token, cuenta y zona.

## Permisos

Cada endpoint se consulta con GET. Los resultados se clasifican como `granted`, `denied` o `unavailable`. Un permiso requerido denegado bloquea discovery.

## Inventario

Se importan seis familias: Workers, D1, R2, Queues, DNS y Secrets Store. Los provider IDs se convierten a SHA-256 y la configuración se vuelve un digest canónico. El resultado no contiene token ni IDs originales.

## Rate limits

Cada respuesta produce una observación. Con menos de 10% restante se ordena `throttle`; con cero, `stop`. Cloudflare documenta actualmente un límite general de 1.200 requests por cinco minutos para tokens de usuario o cuenta.
