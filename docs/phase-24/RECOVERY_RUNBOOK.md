# Runbook de recuperación

1. Detener nuevos claims y escrituras externas.
2. Seleccionar el último backup con verificación aprobada.
3. Crear un plan con el objetivo RPO/RTO aplicable.
4. Obtener aprobación independiente.
5. Restaurar en una ruta vacía y aislada.
6. Ejecutar integridad física y lógica.
7. Comparar conteos y high-water transaction.
8. Confirmar que `delivered` permanece entregado y `pending` es recuperable.
9. Medir transacciones perdidas, RPO y RTO.
10. Mantener la base restaurada fuera de producción hasta autorización explícita.

Nunca sobrescribir la base origen ni reutilizar un destino existente durante el simulacro.
