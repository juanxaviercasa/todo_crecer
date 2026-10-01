# Runbook de teardown

1. Congelar nuevas promociones y trabajos.
2. Capturar inventario y drift finales.
3. Confirmar backups, retenciones y recursos compartidos.
4. Crear un plan con orden inverso de dependencias.
5. Obtener aprobación de destrucción independiente.
6. Eliminar sólo recursos con lifecycle `managed`.
7. Verificar que los recursos `shared` y `retain` permanezcan.
8. Capturar un inventario final y cerrar el presupuesto.

El escenario elimina de forma simulada ocho recursos y conserva Secrets Store. Si existe cualquier recurso no inventariado o dependencia desconocida, el adaptador real debe bloquear el teardown.
