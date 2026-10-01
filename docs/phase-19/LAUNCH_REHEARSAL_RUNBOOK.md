# Runbook del ensayo de lanzamiento

## Precondiciones

- Nueve requisitos con evidencia.
- Cuatro revisiones independientes aprobadas.
- Aceptación vigente del propietario.
- Evaluación `ready_for_rehearsal` sobre el mismo hash.

## Pasos

1. Verificar la unión entre snapshot, revisiones y aceptación.
2. Confirmar derechos y estado técnico de los activos.
3. Confirmar copy, hechos y diseño aceptados.
4. Confirmar privacidad y contacto público.
5. Validar localmente el plan de hostname.
6. Comprobar responsable, métricas y ruta de rollback.
7. Sellar el resultado y conservar la auditoría.

## Fallo

Un solo paso fallido produce `failed`. El sistema no genera paquete y no permite convertir el ensayo en `apply`.

## Alcance local

El ensayo mantiene `external_changes: 0`, `external_messages: 0` y `publication_performed: false`. No usa credenciales ni verifica el control real de DNS.
