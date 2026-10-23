# Validación futura: Introducción y sala

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 002, 004; no bloquea prototipo de 005 o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/003-intro-room.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/003-intro-room.spec.ts`.
Caso manual: Omitir cada plano y reanudar en ambos checkpoints; comparar permisos y subtítulos con guion.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
