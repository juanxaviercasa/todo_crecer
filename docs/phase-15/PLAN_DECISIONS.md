# Decisiones comerciales pendientes

Los siguientes valores no deben inventarse en código:

- nombres comerciales definitivos;
- precios, moneda e impuestos;
- periodicidad y fecha de cobro;
- duración de prueba;
- límites mensuales contratados;
- política de exceso de uso;
- reembolsos, cancelación y reactivación;
- descuentos o promociones;
- proveedor de pagos y país de la entidad que factura;
- contenido contractual y comprobantes.

Cuando estas decisiones existan, deben versionarse fuera del código ejecutable y referenciarse mediante `commercial_terms_ref`. Un cambio de términos no debe alterar retrospectivamente el documento aceptado por un cliente.
