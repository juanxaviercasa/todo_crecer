# ADR-018: experiencias por modelo inmobiliario

- Estado: aceptado
- Fecha: 2026-09-30

## Decisión

El sistema no tratará “inmobiliaria” como una sola plantilla. Mantendrá una base común de seguridad, marca, procedencia y rendimiento, pero seleccionará un módulo principal según la tarea comercial del negocio.

La primera matriz incluye catálogo amplio, desarrolladora, asesoría boutique, proyectos/lotes y tasación para propietarios. Cada módulo valida como dato estructurado antes de renderizarse.

## Consecuencias

- El diseño puede conservar calidad común sin borrar la especialización.
- Añadir una categoría exige contrato, contenido, componente, pruebas y revisión visual.
- Un módulo no puede afirmar disponibilidad, avance, legalidad o valoración sin fuentes verificadas.
- La demo muestra controles desactivados y no recopila información.
- Las métricas futuras se medirán por tarea: exploración, comprensión, diagnóstico, comparación o brief completado.
