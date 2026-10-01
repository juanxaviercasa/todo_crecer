# Estado deseado, observado y reconciliación

Cada sitio tiene una generación deseada y una observada, junto con receta, diseño, motor y digest de configuración.

- Estados iguales: `no_op`.
- Deseado más reciente con diferencias: `ready`.
- Deseado más antiguo que lo observado: `blocked`.

Las diferencias se traducen en `apply_recipe`, `apply_design`, `apply_engine` o `apply_configuration`, seguidas por `verify_state`. El plan conserva `external_changes: false`; en una implementación futura, sólo un adaptador autorizado podrá realizar la operación.
