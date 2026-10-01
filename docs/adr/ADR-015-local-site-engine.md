# ADR-015 — Motor local determinista para demos sintéticas

Estado: implementado para Fase 1, versión 0.3.0.

Se usa Node.js y plantillas de componentes tipados para convertir los contratos
actuales en HTML/CSS sin dependencias de frontend, llamadas a IA ni servicios remotos.
Se mantiene la compatibilidad byte a byte de los contratos y fixtures de Phase 0.

Se separan gates de entrada, render, build, servidor local y QA de navegador. La
evidencia de QA apunta al build real, mientras los fixtures históricos siguen intactos.
El build ID incluye contenido renderizado para que un cambio de plantilla no reutilice
artefactos anteriores. QA es metadata con historial, no una mutación de HTML/CSS.

Consecuencias: solo se soportan los componentes y modos explícitos; otras capacidades
fallan de forma visible. No se implementa la puntuación editorial ni publicación.
La próxima fase podrá agregar un adaptador de almacenamiento y colas sin cambiar
la función de render, una vez definida la política de datos reales.
