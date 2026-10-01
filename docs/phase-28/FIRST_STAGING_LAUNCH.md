# Primer lanzamiento de staging

El recorrido tiene estados cerrados: `draft`, `discovered`, `planned`, `approved`, `applied`, `verified`, `rolled_back`, `closed` y `blocked`.

1. Crear la intención con hostname, clasificación y fingerprints de cuenta y zona.
2. Importar discovery de solo lectura.
3. Conciliar observado contra deseado y revisar huérfanos.
4. Aprobar el cost envelope con warning y hard stop.
5. Crear un plan ligado a los cuatro artefactos anteriores.
6. Recoger las aprobaciones independientes de plataforma, seguridad y finanzas.
7. Emitir un nonce apply de un solo uso y máximo quince minutos.
8. Aplicar únicamente las acciones `create` y `update` del digest aprobado.
9. Ejecutar doce smoke checks o rollback.
10. Cerrar ambas sesiones y sellar el expediente.

La implementación local permite un ensayo completo. El estado real queda bloqueado mientras el import tenga fuente `synthetic-rehearsal`.
