# Auditoría resistente a manipulaciones

Cada entrada contiene secuencia, actor, acción, sujeto, decisión, digest de detalles, hash anterior, hash propio, key ref y firma Ed25519.

La verificación recalcula cada hash, comprueba la continuidad con la entrada anterior y valida todas las firmas. Informa la primera secuencia defectuosa. Una modificación en cualquier entrada invalida esa posición y la continuidad posterior.

Los detalles completos no se incorporan a la entrada; se conserva un digest para reducir exposición. En producción, la cadena debe replicarse a almacenamiento inmutable administrado por una frontera diferente del control plane.

Las attestations de artefacto vinculan nombre, digest del bundle, digest del manifiesto, firmante, clave, ambiente y firma. Así se comprueba exactamente qué paquete fue autorizado.
