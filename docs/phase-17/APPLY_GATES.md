# Gates para un apply real

Antes de habilitar un adaptador externo deben cumplirse todos estos puntos:

1. Cuenta y zona de staging expresamente autorizadas.
2. Token de mínimo privilegio guardado fuera del repositorio.
3. D1, R2 y Queue creados para staging, separados de producción.
4. Política de Custom Hostnames y certificados aprobada; exigir hostname `active`, `ssl.status: active` y DNS dirigido al objetivo SaaS.
5. Build perteneciente a un negocio colaborador y autorizado.
6. Plan exacto revisado por una persona distinta de su creador.
7. Backups, restauración y rollback ensayados.
8. Alertas de errores, latencia, drift y costes habilitadas.
9. Límites de gasto y cuotas definidos.
10. Ventana operativa y responsable humano identificados.

La presencia de credenciales no satisface por sí sola estos gates. El modo `apply` debe habilitarse explícitamente en configuración y en el adaptador.
