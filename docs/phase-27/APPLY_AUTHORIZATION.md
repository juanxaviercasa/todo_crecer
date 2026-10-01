# Autorización de apply

El plan contiene discovery ref, manifest digest, acciones, request estimate, coste y plan digest.

Antes de autorizar se requieren tres decisiones independientes:

- Plataforma confirma topología y dependencias.
- Seguridad confirma permisos, firmas y manejo de secretos.
- Finanzas confirma límite y coste.

La autorización dura entre uno y quince minutos. Devuelve el nonce una sola vez y sólo conserva su hash. El apply exige sesión específica, plan digest idéntico y nonce válido. Al primer uso pasa a `consumed`.

Los requests usan claves de idempotencia derivadas del plan y orden. Los recibos registran método, endpoint template, request/response digest, HTTP status y si ocurrió cambio externo. No registran token, cuenta, zona ni body completo.
