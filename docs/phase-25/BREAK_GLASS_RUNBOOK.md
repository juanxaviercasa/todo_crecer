# Runbook de acceso break-glass

## Activación

1. Abrir un incidente y obtener su identificador.
2. Describir el motivo operativo con suficiente detalle.
3. Solicitar sólo tenants y capacidades imprescindibles.
4. Usar una duración entre 60 y 900 segundos.
5. Obtener aprobación de una persona distinta al solicitante.

## Durante la ventana

- Cada uso debe coincidir exactamente con tenant y capability.
- No se permite añadir alcance a una sesión activa.
- La actividad se registra en la cadena de auditoría.
- Si desaparece la necesidad, el aprobador o administrador revoca la sesión.

## Cierre

La sesión expira automáticamente. El responsable del incidente debe revisar sus accesos, confirmar que no hubo ampliación y enlazar la verificación de auditoría al expediente. Una sesión vencida nunca se reutiliza.

## Ensayo local

El escenario `INC-SYNTH-2501` activa cinco minutos de inspección sobre `tenant-horizonte`. No abre sistemas externos ni modifica producción.
