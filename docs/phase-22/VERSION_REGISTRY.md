# Registro de versiones y compatibilidad

Las versiones usan SemVer estricto `major.minor.patch`. Una receta declara el rango compatible del motor y uno o más rangos de sistemas visuales. El límite superior es exclusivo.

Una evaluación puede ser incompatible por:

- receta o diseño sin activar;
- motor fuera de rango;
- familia visual no permitida;
- versión visual fuera del rango de la receta;
- cruce de tenant.

Los contenidos completos de tokens y componentes no se copian al registro operativo. Se almacenan sus digests para detectar diferencias entre lo esperado y lo observado.
