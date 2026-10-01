# Identidades, credenciales y rotación

## Identidad de workload

Una identidad registra nombre, estado, tenants, capacidades y etiquetas de responsabilidad. El binding añade runtime, sujeto verificable y ambiente. Suspender o revocar la identidad bloquea de inmediato credenciales aún no vencidas.

## Credencial breve

La credencial local usa un sobre `hct1`, payload canónico y firma Ed25519. El registro durable contiene identificador, key ref, scopes, emisión, vencimiento y hash del token. Nunca contiene el token reutilizable.

El TTL aceptado está entre 30 y 900 segundos. El escenario usa 300 segundos. Solicitar tenants o capacidades que la identidad no posee produce `SCOPE_ESCALATION`.

## Rotación

Una rotación crea una clave activa y pasa la anterior a `retiring`. Durante la gracia, credenciales anteriores siguen verificándose. Al finalizar, el sweep marca la clave como `retired` y sus credenciales dejan de ser válidas.

En staging, las claves privadas deben permanecer dentro del KMS. La aplicación sólo debe recibir operaciones de firma y material público de verificación.
