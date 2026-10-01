# Staging Control Plane

## Objetivo

Demostrar el recorrido completo de preproducción con datos sintéticos: declarar, validar, planificar, provisionar, inventariar, promover, comprobar, revertir y retirar.

## Recursos del escenario

1. D1 para estado del control plane.
2. R2 para artefactos firmados.
3. Queue para eventos durables.
4. Secrets Store como recurso retenido.
5. Worker de identidad.
6. Service binding hacia identidad.
7. Worker del control plane.
8. Observabilidad.
9. Hostname de staging.

El grafo impide crear un consumidor antes que sus dependencias. Los ciclos y referencias inexistentes bloquean el plan.

## Frontera de adaptador

El motor no llama APIs directamente. El adaptador declara modo, proveedor, capacidades y si produce cambios externos. La entrega incluye un adaptador sintético y otro bloqueado. Un adaptador real deberá implementar provision, inventory, probe, rollback, teardown y cost observation.

## Estado actual

El ensayo usa `local-synthetic`, conserva el Secrets Store lógico y registra cero cambios externos. La plantilla de Wrangler no contiene identificadores ni secretos válidos.
