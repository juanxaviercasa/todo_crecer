# Matriz de permisos del portal

| Acción | Propietario | Operador | Administrador |
|---|---:|---:|---:|
| Ver resumen del tenant | Sí | Sí | Sí |
| Ver casos operativos | Sí | Sí | Sí |
| Revelar contacto con AAL2 reciente | Sí | Sí | Sí |
| Cambiar preferencias propias | Sí | No | Sí |
| Presentar solicitud de privacidad | Sí | No | Sí |
| Procesar solicitud de privacidad | No | Sí | Sí |
| Proponer cambio del negocio | Sí | No | Sí |
| Revisar cambio del negocio | No | Sí | Sí |
| Revocar la sesión propia | Sí | Sí | Sí |

Todos los permisos se evalúan dentro del `tenant_id` ya ligado a la sesión. Un rol no puede utilizar la misma sesión para saltar a otro negocio.
