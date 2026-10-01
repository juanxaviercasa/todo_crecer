# Preflight y control de coste

El preflight recibe valores únicamente en memoria. Persiste tres listas: nombres requeridos, presentes y ausentes. `secret_values_persisted` debe ser siempre cero.

El escenario requiere metadatos para cuenta, zona, D1, R2, Queue, Secrets Store y health endpoint. Tener un nombre presente no prueba que el permiso remoto exista; el adaptador real deberá hacer comprobaciones de sólo lectura y devolver evidencia redactada.

El presupuesto tiene un límite mensual, advertencia y hard stop. Antes de ejecutar se compara el mayor valor entre coste observado y estimado. La acción resultante es `allow`, `warn` o `block`. `block` impide todo cambio.

El escenario estima 2.100 centavos de dólar, observa 1.260 y aplica un límite de 5.000; el resultado es `allow`. Estas cifras son sintéticas y no son una cotización de Cloudflare.
