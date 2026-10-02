# Cifrado y claves

La evidencia retenida se cifra con AES-256-GCM. El expediente conserva IV, etiqueta de autenticación, texto cifrado, huella y referencia de clave; la clave no se escribe en archivos ni manifiestos. En producción, la referencia deberá resolver a un gestor de claves externo.
