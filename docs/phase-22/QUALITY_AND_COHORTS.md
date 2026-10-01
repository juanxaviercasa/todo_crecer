# Calidad y cohortes

La puntuación global usa estas ponderaciones:

- verdad y evidencia: 25%;
- diseño visual: 20%;
- accesibilidad: 20%;
- rendimiento: 20%;
- conversión: 15%.

Los hard gates de esquema, verdad, privacidad y rollback pueden bloquear el sitio aunque el promedio sea alto. Una cohorte define el umbral para avanzar y un umbral inferior para revertir.

Los pasos deben crecer y terminar en 100%. Cada checkpoint decide `pass`, `hold` o `rollback`. El sistema nunca salta un paso y no programa el siguiente por sí mismo.
