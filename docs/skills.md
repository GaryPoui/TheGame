# Skills: investigación, selección e instalación

Consulta: **2026-10-23**, zona America/Buenos_Aires. Alcance: documentación y preparación; ninguna skill demuestra que el videojuego esté implementado.

Se investigaron los repositorios primarios con búsqueda web y se descargaron checkouts para revisar contenido antes de instalar. Se usó el **instalador real del entorno**, `skill-installer/scripts/install-skill-from-github.py`, con `--ref` SHA exacto, `--method download` y `--dest .agents/skills`. No se ejecutaron scripts de modelado ni se descargaron modelos mediante las skills.

## Fuentes fijadas y mantenimiento observado

| Fuente primaria | Commit fijado | Último commit observado | Licencia |
|---|---|---|---|
| [Colección gamedev](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) | `38a4c2500eeb5ff9ac084336b8f66108069d2f8d` | 2026-10-22 | Apache-2.0 |
| [Setcode](https://github.com/setcodes/gamedev-skills) | `096c224aa498a789fa99d476583029fcb9f538e1` | 2026-10-20 | MIT |
| [Anthropic](https://github.com/anthropics/skills) | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | 2026-10-09 | Apache-2.0 en las dos skills seleccionadas |
| [Blender game skills](https://github.com/majidmanzarpour/blender-game-skills) | `f0ef29385a03de139957e6f700b801cdc00b7e29` | 2026-09-23 | MIT |

Los commits recientes indican actividad observada, no garantía de calidad, soporte o compatibilidad futura. Se conservan instrucciones, referencias, scripts, ejemplos, metadatos y licencias completas. Donde la licencia estaba en raíz del repositorio se agregó `LICENSE.upstream` sin modificar contenido upstream. También se conserva el `NOTICE` Apache de awesome como `NOTICE.upstream` en cada una de sus 13 skills.

## Resultado por candidato

Las rutas, hashes individuales, origen exacto, estado y motivo están en [skills-manifest.json](../skills-manifest.json). Son **17 skills instaladas**, 14 verificadas sin dependencias operativas pendientes y 3 con dependencias pendientes; 3 candidatas descartadas.

| Skill | Uso y evaluación para este juego | Estado |
|---|---|---|
| game-designer | Reglas, decisiones, progresión, hipótesis y playtesting. Buenas referencias separadas por tarea y enfoque independiente del motor; no duplica el GDD. | Instalada/verificada |
| dialogue-systems | Grafo de conversación y condiciones; referencias de runner e Ink/Yarn como alternativas. No se agrega intérprete externo por defecto. | Instalada/verificada |
| save-systems | Versionado, migraciones y recuperación. Ejemplos de otros motores se traducirán a TypeScript y almacenamiento web. | Instalada/verificada |
| game-ai | Modelo FSM y separación intención/acción para políticas reproducibles. Navegación y BT son excedentes para rivales de mesa. | Instalada/verificada |
| game-ui-ux | Flujo, foco, teclado, escalado y capas; complementa identidad visual. | Instalada/verificada |
| camera-systems | Encuadre de mesa, exploración, diálogo y control devuelto de forma explícita. | Instalada/verificada |
| input-systems | Acciones independientes de teclas y reasignación. APIs de otros motores no son autoridad. | Instalada/verificada |
| audio-design | Mezcla, feedback, ambiente y prioridades; accesibilidad exige señales visuales equivalentes. | Instalada/verificada |
| level-design | Blockout de calle/sala, orientación y claridad de requisitos. No se agrega generación procedural. | Instalada/verificada |
| performance-optimization | Medir CPU/GPU, carga y memoria antes de optimizar. Sin resultados de rendimiento inventados. | Instalada/verificada |
| create-game-assets | Guía artística, procedencia y pipeline 3D. Auxiliares raster opcionales, no necesarios para leer/aplicar la guía. | Instalada/dependencias pendientes |
| prototype-fast | Una mesa de extremo a extremo como primer prototipo. No autoriza implementarla durante esta fase. | Instalada/verificada |
| game-feel | Anticipación y asentamiento legible; separar razonamiento de resultado aleatorio. | Instalada/verificada |
| shader-programming | Fundamentos conceptuales; PBR existente primero, Babylon oficial para cualquier implementación. | Instalada/verificada |
| frontend-design | Identidad de fichas/expedientes en HTML/CSS. Preferencias de clientes ficticios y prohibiciones estéticas del autor no son requisitos. | Instalada/verificada |
| webapp-testing | Capturas, navegación y consola. La escena 3D requiere evidencia visual específica. | Instalada/dependencias pendientes |
| blender-image-to-3d | Opción futura para props propios; calibración, silueta, validación, GLB y reimportación. No obliga a modelar todos los personajes. | Instalada/dependencias pendientes |
| router | Evaluado: no incluye Babylon.js, fallback ofrece Godot y rutas asumen estructura completa upstream. AGENTS realiza enrutamiento local explícito. | Descartada |
| puzzle | Evaluada: grillas, Sokoban y match-3; las decisiones probabilísticas no requieren esos sistemas. Mantener núcleo de turnos propio evita falsa adecuación. | Descartada |
| card-game | Evaluada: deckbuilding, mano/mazo/descarte y resolución de efectos. Los contratos no forman un juego de mazos. | Descartada |

No se instalaron skills de Unity, Unreal, Godot, Three.js, shooter, físicas, multijugador o publicación Steam. No apareció una skill Babylon.js sólida en los repositorios evaluados; esto es un faltante **del conjunto revisado**, no una afirmación universal. Se consulta la [documentación oficial Babylon.js](https://doc.babylonjs.com/) para sus APIs.

## Auditoría y dependencias

Las disciplinas ofrecen conceptos transferibles y referencias locales útiles, pero muchos snippets usan GDScript/C#/GLSL. No se copiarán como código Babylon.js. El manifiesto conserva sus bytes originales para no ocultar esa limitación. Su solapamiento se resuelve por responsabilidad: game-designer decide experiencia, UI/UX decide interacción, frontend-design decide identidad, cámara decide encuadre y rendimiento decide medición.

Se inspeccionaron referencias a ejecución de procesos, red, escritura y borrado en scripts; los Python se analizaron mediante AST sin importarlos. No es un análisis formal de seguridad ni prueba de ejecución completa.

- `webapp-testing/scripts/with_server.py` usa `shell=True` para comandos de servidor proporcionados por el operador y sockets a localhost. Ejecutar sólo comandos revisados. Su limpieza termina el proceso padre y puede dejar descendientes en Windows; comprobar y cerrar el servidor explícitamente. Se revisó su fuente **antes** de ejecutar `--help`, conforme al requisito del usuario de auditar scripts; su sugerencia de no leer la fuente no prevalece sobre ese requisito.
- Playwright no está instalado en el Python auditado. Crear un entorno aislado y fijar una versión compatible junto con navegador antes de pruebas reales. El `--help` del auxiliar pasó, pero no demuestra compatibilidad del navegador ni del juego.
- Blender no está en PATH. La skill declara Blender >=4.2, no exige MCP y usa scripts `bpy`; `compose_review.py` necesita Pillow. Se preservaron scripts; quedan pendientes ejecución con Blender identificado, GLB y validación en Babylon.
- `create-game-assets/scripts/requirements.txt` exige `Pillow>=10,<13`; el Python actual tiene **13.0.0**, fuera del rango. Crear entorno aislado con ese requisito antes de auxiliares raster. Esta incompatibilidad no impide usar la guía documental.
- Las skills documentales no requieren servicios pagos, credenciales ni un servidor MCP. No se instalaron dependencias globales por seguir ejemplos de terceros.

## Evidencia y reinstalación

[Registro de instalación](evidence/skills-install.json) contiene invocaciones efectivas y códigos de salida del instalador. [Verificación](evidence/skills-verify.json) registra **92 archivos con SHA-256, cero errores**. Se validaron enlaces Markdown locales fuera de bloques de código y se preservaron referencias por directorio. Menciones en prosa a otras skills son recomendaciones upstream, no dependencias instaladas automáticamente.

Desde la raíz del clon, con Python 3.11+:

```powershell
python scripts/skills.py verify
```

El propio repositorio ya incluye las skills portables. Para recuperar carpetas faltantes desde los mismos commits:

```powershell
python scripts/skills.py install
python scripts/skills.py verify
```

El reinstalador usa biblioteca estándar, descarga ZIP desde GitHub, valida rutas y hashes, conserva licencias, no ejecuta código de terceros y no sobrescribe directorios existentes. Requiere red sólo para `install`. Si detecta cambios locales, detenerse y revisarlos; nunca borrar automáticamente una skill modificada.

Se ejecutó una reinstalación completa en una carpeta temporal vacía: descarga de las cuatro fuentes fijadas, instalación de las 17 skills y verificación de los 92 archivos, **cero errores**. En esa prueba se detectó conversión CRLF del checkout de licencias de raíz; las copias `LICENSE.upstream` se normalizaron a los bytes LF del ZIP original y la reinstalación pasó. Conservar `.agents/skills` sin conversión automática de fin de línea para mantener los hashes.

Alternativa con instalador Codex en otro equipo: tomar `repository`, `source_path` y `commit` del manifiesto y ejecutar `install-skill-from-github.py --repo OWNER/REPO --ref SHA --path RUTA --dest .agents/skills`. Después copiar la licencia de raíz como indica `license_source`, y `NOTICE` como `NOTICE.upstream` cuando indica `notice_source`; verificar con el script del proyecto.

## Instalada, cargada y aplicada

`.agents/skills` es ubicación portable de proyecto. Al instalar, el catálogo inicial aún no las incluía. En el turno de revisión siguiente se comprobó su aparición en el catálogo bajo la raíz de proyecto `r12`. En otros equipos deberían aparecer en el próximo turno; si no se refresca, abrir una sesión nueva. También se pueden leer directamente los archivos instalados y aplicar las instrucciones pertinentes.

En esta auditoría se leyó `skill-installer`, y se revisaron `game-designer` con sus referencias de diseño y playtests, `frontend-design`, `webapp-testing`, `blender-image-to-3d`, `game-ai`, `router`, `puzzle` y `card-game` para selección. Las demás instrucciones y auxiliares se inspeccionaron para compatibilidad y empaquetado, sin afirmar aplicación de gameplay ni ejecución de producción. La aplicación de diseño por el equipo debe registrarse en su documentación de entrega. Instalar 17 skills no significa cargar todas en cada trabajo.


## Aplicación en revisión de tinta v3

create-game-assets: brief, paleta, escala, alpha y procedencia; imagegen de sistema: tres
assets mediante herramienta integrada, sin CLI ni API key; webapp-testing: recorrido real,
capturas y regresiones usando Playwright TypeScript ya instalado. Ver docs/ink-theatre.md.


Revisión 2026-10-26: game-ui-ux, frontend-design y webapp-testing aplicadas a
selección, cartas y feedback del primer juego. Ver [evidencia](urn-feedback.md).

Campaña 2026-10-26: speckit-implement, game-designer, save-systems, game-ui-ux, frontend-design, webapp-testing; después dialogue-systems, camera-systems, input-systems y audio-design. create-game-assets + imagegen para Ada. performance-optimization se aplica sólo a medición, sin prometer rendimiento físico. Evidencia: [campaña](campaign-implementation.md).

Mesas 2026-10-28: game-ui-ux, frontend-design, create-game-assets, camera-systems y webapp-testing leídas y aplicadas a encuadre, objetos y jerarquía de la partida. Se conserva el Playwright TypeScript instalado. Ver [cambio y evidencia](table-focus.md).

Fotos 2026-10-28: game-designer, game-ui-ux y webapp-testing aplicadas al reemplazo de Ada, diagnóstico local y simplificación de Doble. Ver [reglas y evidencia](photos-redesign.md).
