# Seguridad zero trust de la Fase 25

## Objetivo

Proteger el control plane antes de conectarlo a infraestructura real. La fase transforma la confianza implícita en decisiones verificables y registradas.

## Flujo de autorización

1. Un workload se vincula a una identidad registrada.
2. El broker comprueba que la identidad esté activa y emite una credencial breve.
3. La credencial declara audiencia, tenants, capacidades, clave, emisión y vencimiento.
4. Cada solicitud verifica firma, hash persistido, revocación y vigencia.
5. La política evalúa ambiente, riesgo y MFA.
6. Se registra una decisión `allow` o `deny` y una entrada de auditoría firmada.

## Límites de confianza

- Una red interna no concede acceso.
- Una identidad no puede ampliar su propio scope.
- Un token no puede cambiar audience, tenant ni capacidad sin invalidar la firma.
- Los fallos se cierran en denegación.
- El token completo no se persiste; sólo queda su hash.

## Implementación local

`packages/zero-trust-security/index.cjs` contiene el motor de referencia en memoria. Usa criptografía Ed25519 real, pero genera claves efímeras para el ensayo. En staging, las interfaces deben conectarse a un proveedor de identidad y un KMS o gestor de secretos sin cambiar los contratos públicos.
