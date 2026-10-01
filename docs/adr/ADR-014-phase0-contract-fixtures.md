# ADR-014 — Contratos de Phase 0 y fixture sintético

Estado: propuesta de implementación entregada, 2026-09-29.

Se conservan los tres esquemas originales y se añaden contratos Draft 2020-12 para
BrandProfile, SiteSnapshot, AgentOutput y seis eventos. Se usa resolución local de
referencias, resultados tipados embebidos y hashes de archivos para integridad.
La versión del paquete sube a 0.2.0; los documentos nuevos empiezan en 0.1.0.

El Golden Business es sintético porque esta entrega no contiene datos reales con
evidencia de procedencia. Separa demostración de contratos de autorización para
publicar. SiteSnapshot describe una muestra HTML local sin afirmar QA ni deployment.

Consecuencias: los eventos son autocontenidos pero pueden crecer; definir límites de
tamaño del transporte y referencias a almacenamiento en una versión futura. Las
reglas entre documentos viven en el checker del fixture y deberán extraerse a un
servicio de políticas para datos reales. La serialización es exacta por bytes y no
canónica; cualquier reserialización exige recalcular hashes. No se añaden servicios,
credenciales ni infraestructura durante esta iteración.
