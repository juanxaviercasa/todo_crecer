# ADR-036 — Primer lanzamiento de staging con expediente sellado

## Estado

Aceptado para la Fase 28.

## Decisión

Todo lanzamiento de staging se modela como un expediente inmutable. La intención referencia una cuenta y zona únicamente mediante fingerprints. Un discovery de solo lectura se concilia contra el estado deseado; después se fija presupuesto y plan. Plataforma, seguridad y finanzas aprueban el mismo digest. Apply usa una autorización de un solo uso y máximo quince minutos.

El lanzamiento se considera terminado únicamente después de smoke aprobado o rollback ejecutado, cierre de las sesiones read/apply y sellado del expediente. Un ensayo sintético nunca satisface el requisito de discovery real.

## Consecuencias

El sistema puede ensayar el recorrido completo sin credenciales ni efectos externos. La primera ejecución real exige configuración fuera del repositorio, una cuenta elegida, DNS/TLS operativo y aprobación humana del plan exacto.
