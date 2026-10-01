@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Necesitas instalar Node.js 18 o superior para iniciar el motor.
  pause
  exit /b 1
)
if not exist "node_modules\ajv\package.json" (
  echo Instalando dependencias. Este primer paso necesita Internet.
  call npm.cmd ci --ignore-scripts
  if errorlevel 1 goto failure
)
call npm.cmd run build
if errorlevel 1 goto failure
echo.
echo Abre http://127.0.0.1:4173 en tu navegador.
echo Manten esta ventana abierta. Ctrl+C detiene el servidor.
call npm.cmd start
if errorlevel 1 goto failure
exit /b 0
:failure
echo No se pudo completar el inicio. Revisa el mensaje anterior.
pause
exit /b 1
