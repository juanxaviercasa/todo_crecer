# Topología, inventario y drift

## Orden

El motor usa orden topológico. D1, R2, Queue y Secrets Store se declaran primero; identidad y service binding dependen de secretos; el control worker depende de estado, objetos, eventos e identidad; observabilidad y hostname cierran el grafo.

## Inventario

Cada recurso observado contiene referencia lógica, tipo, nombre, digest, estado y provider ref. El inventario completo obtiene un digest propio. Las referencias del escenario usan el esquema `synthetic://`.

## Drift

Se compara presencia y digest deseado contra observado. Un recurso ausente o con digest cambiado produce drift crítico. Los secretos nunca se comparan por valor; sólo puede comprobarse metadata y binding.

Un adaptador real debe hacer inventario mediante permisos de lectura y no debe registrar tokens, IDs sensibles innecesarios ni valores de Secrets Store.
