# Catálogo inicial de SLO

| Servicio | Ventana | Disponibilidad | Latencia p95 | Muestra mínima |
|---|---:|---:|---:|---:|
| Site router | 60 min | 99.0% | 500 ms | 20 |
| Publication | 60 min | 99.0% | 2000 ms | 5 |
| Owner portal | 60 min | 99.0% | 800 ms | 10 |

Estos objetivos son técnicos y provisionales para staging. Antes de producción deben revisarse con volumen representativo, dependencia de proveedores y expectativas comerciales aprobadas.

Un estado `breached` aparece cuando falla disponibilidad o latencia. `at_risk` aparece al consumir al menos 80% del error budget o al alcanzar 80% del umbral de latencia. Una muestra menor al mínimo produce `insufficient_data`.
