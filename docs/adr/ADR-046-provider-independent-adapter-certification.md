# ADR-046: Certificación de adaptadores independiente del proveedor

**Estado:** Aceptado · **Fecha:** 2026-10-03

La fase 38 valida ahora el comportamiento futuro mediante un contrato portable, trece vectores deterministas, inyección de fallos y replay de evidencia sanitizada. El proveedor real no podrá cambiar reglas ni ponderaciones; deberá implementar el contrato y pasar la misma suite.

Un certificado de simulación acredita el motor y el adaptador de referencia. No selecciona proveedor, no habilita compras y no autoriza escrituras.
