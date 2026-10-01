# Runbook de credenciales Cloudflare

1. Preferir un account-owned token para CI cuando los endpoints requeridos lo soporten.
2. Limitarlo a la cuenta de staging y a permisos read durante discovery.
3. Configurar TTL y, si es viable, filtro de IP.
4. Guardarlo únicamente en el secret store de CI.
5. Ejecutar `npm run discover:cloudflare` y revisar el informe redactado.
6. Crear una credencial apply separada y más breve sólo después de aprobar el plan.
7. Revocarla al finalizar apply, smoke y evidencia.
8. Rotar inmediatamente ante cualquier exposición.

Nunca pegar el token en archivos, argumentos de línea de comandos, tickets o mensajes. El programa sólo lo acepta mediante variable de entorno.
