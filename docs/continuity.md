# Continuidad de la entrega documental

Proyecto: [GaryPoui/TheGame](https://github.com/GaryPoui/TheGame).
Rama de entrega: `codex/research-specs-skills`. Base: `main` con README mínimo al comenzar.
La investigación comenzó el 2026-10-22 y la auditoría de skills continuó el 2026-10-23,
America/Buenos_Aires. Los documentos conservan su fecha de consulta, no una fecha única ficticia.

## Hecho realmente

- Se leyó y conservó íntegro [el prompt](original-prompt.md), incluidas ampliaciones visuales.
- Se verificaron repo, rama, árbol limpio inicial, Git y acceso GitHub; no se guardaron credenciales.
- Se investigaron fuentes primarias y se distinguieron hechos, propuestas e hipótesis.
- Se instalaron 17 skills portables auditadas con commits, licencias, referencias y reinstalación.
- Se instaló Specify CLI 1.2.3 y se ejecutó init real con integración Codex y PowerShell.
- Se aplicó el flujo documental, constitución 1.0.0 y diez specs con planes/tareas/checklists.
- Se fijaron paquetes estables consultados al registro y se generó lockfile sin scripts de paquetes.
- Se documentaron diseño, narrativa, matemáticas, arte, UI, arquitectura, validación y riesgos.
- Se verificaron matemáticas del diseño con enumeración exacta y se revisaron contradicciones.

## Propuesto, sin implementar

Título La Casa del Azar, campaña 30–45 min, urnas/contratos/registros/final. Babylon.js 9.32.0,
TypeScript 7.0.2, Vite 8.3.5; guardado local, RNG reproducible y HTML/CSS. Los paquetes están
resueltos en lockfile, no probados como aplicación integrada. No existen src, build, juego jugable,
GLB, sonidos, screenshots de juego, perfiles de GPU ni estudio educativo. Ninguna tarea de
implementación está marcada como terminada.

## Evidencia disponible

- `docs/evidence/specify-init.txt`, version/integration y spec-workflow: instalación y scripts reales.
- `docs/evidence/skills-install.json`, skills-verify: instalación, archivos, licencias y hashes.
- `docs/evidence/math-verification.json`: comprobaciones exactas del diseño, no del runtime.
- `docs/evidence/npm-versions.json`: versiones, licencias e integridad consultadas.
- `docs/evidence/docs-verification.json`: estructura, enlaces locales y pins/lock.
- [Análisis](consistency-analysis.md): revisión semántica, hallazgos y correcciones.

## Preparar otro equipo

1. Clonar repo y hacer checkout de la rama/commit de esta entrega; no depende del historial del chat.
2. Leer README, AGENTS, constitución y educational-design.
3. Python 3.11+: `python scripts/skills.py verify`. Las skills ya están en el clon;
   si faltan carpetas usar `python scripts/skills.py install` y verificar de nuevo.
4. Para CLI Spec Kit: `python -m pip install --user uv`, luego
   `python -m uv tool install specify-cli==1.2.3`; agregar su bin a PATH o usar ruta devuelta.
   No volver a inicializar encima de documentos existentes. Leer [procedimiento](spec-kit.md).
5. Ejecutar `python scripts/verify-math.py` y `python scripts/verify-docs.py`.
6. Node >=22.12: cuando se autorice implementar, `npm ci`; preparar scripts y tsconfig en 001.
   Instalar browser de Playwright sólo al comenzar pruebas reales; no afirmar cobertura ahora.

Auxiliares opcionales pendientes: Blender >=4.2 identificado, entorno Python Playwright y Pillow
compatible con auxiliares raster. No bloquean lectura de skills ni documentación. Instalada no
significa cargada: catálogo puede requerir próximo turno/nueva sesión; archivos fueron leídos
directamente para aplicar instrucciones. Detalles y riesgos de scripts en docs/skills.md.

## Siguiente paso preciso

Esperar instrucción posterior de implementación. Empezar por 001, luego cámara 002, runner 004,
contratos/checkpoints mínimos de 009 y tokens/presupuestos de 010; construir 005 completa en sala
simple con un asistente. Revisar legibilidad, matemáticas, reanudación y experiencia antes de
003/006/007/008 y arte de campaña. No empezar produciendo todos los personajes.

## Publicación y enlaces de entrega

El commit y PR definitivos se registran en `delivery.json` en la raíz una vez publicados.
Ese registro identifica el commit de contenido; su propio commit de registro será posterior
para evitar una referencia de hash a sí mismo. El historial Git y el PR permiten recuperar ambos.
No hay deployment ni juego público en esta fase. Nunca hacer force push ni merge no solicitado.

Instantánea antigua: [chat compartido previo](https://chatgpt.com/s/cx_6adacb1e19ec8191882cff4f7533f6db).
No se verificó su contenido y no se usa como autoridad. Un enlace nuevo, si la app permite
generarlo, se registrará en delivery.json; si no, se conservará la limitación exacta. La continuidad
completa y las decisiones posteriores a Babylon.js están en este repositorio.
