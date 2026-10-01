# Expediente de evidencia

El expediente contiene al menos intención, discovery, conciliación, coste, plan, approvals, autorización, receipts, smoke y cierre de credenciales. Si hubo rollback, se agrega como entrada adicional.

Cada entrada incluye referencia, digest y `sanitized: true`. El dossier no puede sellarse hasta que exista smoke aprobado o rollback ejecutado y ambas sesiones estén cerradas. El digest final liga el resultado completo sin copiar secretos.
