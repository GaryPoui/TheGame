# Pipeline de assets y procedencia

Estado: proceso propuesto, sin recursos artísticos incorporados. Fuentes consultadas: 2026-10-22. No confundir referencias, imagen conceptual y asset 3D validado.

## Orden de producción y coste

| Prioridad | Asset / cantidad inicial | Reutilización y criterio |
| --- | --- | --- |
| P0 imprescindible del prototipo | Sala modular gris, mesa, silla, urna, 5 fichas, luz, asistente proxy, paneles HTML, sonidos de selección/revelación | Primitivas y materiales simples son suficientes para probar decisiones y encuadre; un solo rig si se produce personaje. |
| P1 imprescindible campaña | Dos dados legibles, contratos, registros, puerta, grilletes intro, calle de 3–4 planos, tres asistentes y anfitrión | Reutilizar mesa y sala; props y siluetas distinguen estaciones. Personajes adaptados con licencia compatible pueden sustituir modelos propios. |
| P1 reutilizable | Madera, fieltro, metal, papel, módulos pared/suelo, rig y gestos, iconos y componentes HTML | Texturas compartidas, atlas sólo si mejora perfil; variaciones de color no sustituyen símbolos. |
| P2 opcional | Rostros originales complejos, lip sync, doblaje, partículas, shaders propios, decoración secundaria, animación de secuestro | Excluir si compromete mesa completa, legibilidad, carga o entrega. |

Cada incorporación tiene estimación y responsable antes de producirse. Comparar modelado propio con adaptación: horas de licencia/revisión, limpieza, UV, rig y export, además del precio. No asumir recurso gratuito igual a integración gratuita. Blender image-to-3D es opcional; su compatibilidad y scripts se auditan en el manifiesto de skills antes de ejecutar. Ninguna imagen generada prueba geometría, rig o UV utilizables.

## Registro obligatorio

Mantener futuro `assets/manifest.json` y licencias bajo `third-party/assets/<id>/`. Por recurso: ID, autor, URL exacta del recurso y descarga, fecha, versión/hash SHA-256, archivo original, licencia literal, copia local, permisos/atribución exigida, modificaciones, destino, tamaño transferido, dimensiones, triángulos/materiales/huesos cuando corresponda y responsable. Para producción propia, conservar fuente y autoría; no inventar una licencia sobre insumos ajenos. Música, SFX, HDRI, tipografías y referencias incorporadas también se registran. Estado inicial del inventario artístico: vacío.

Candidatos: [Poly Haven](https://polyhaven.com/license) publica modelos/texturas/HDRI CC0; [Kenney](https://kenney.nl/support) declara CC0 para assets de sus páginas y remite a licencia incluida. Revisar cada paquete; logos, herramientas, código del sitio y marcas no quedan automáticamente cubiertos. Source Sans 3 propone [OFL de Adobe](https://github.com/adobe-fonts/source-sans/blob/release/LICENSE.md), que debe acompañar su distribución. No se han descargado estos recursos. Elegir licencias que permitan modificación y redistribución dentro del repo y build; aislar cualquier candidato con derechos inciertos y no incorporarlo.

## Producción y exportación

1. Bloquear silueta, escala y proporción desde cámara real. Unidad de autoría: metro; suelo y mesas con alturas coherentes; pivote al centro de apoyo o bisagra. Nombrar `prop_urna_a`, `chr_asistente_urnas`, `anim_senalar`, sin rutas personales.
2. Crear malla de baja complejidad y UV sin errores. Aplicar/registrar transformaciones; evitar escalas negativas, dobles caras como arreglo automático y materiales innecesarios. Colliders simples separados de detalle. Registrar handedness y comprobar orientación al importar: no corregir rotaciones ad hoc sin documentar.
3. Materiales PBR metallic–roughness; baseColor en espacio correcto y mapas de datos sin tratamiento de color. Revisar canales ORM: oclusión R, roughness G, metallic B cuando corresponda. Sin luz horneada en baseColor que contradiga iluminación. Texturas iniciales 512–1024; 2048 sólo con justificación visible.
4. Rig mínimo y animaciones nombradas; eliminar huesos/keys sin uso. Comprobar reposo, peso, parpadeo, manos, penetración y poses extremas. No inferir calidad de rig por una captura frontal.
5. Conservar `.blend`/fuente y exportar glTF 2.0/GLB con texturas compatibles. [Babylon: Blender a glTF](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/Blender_to_glTF) es referencia de interoperabilidad; comprobar opciones del exportador instalado antes de producir. [Arquitectura oficial de loaders](https://github.com/BabylonJS/Babylon.js/blob/master/.github/architecture/loaders.md) documenta el paquete glTF del motor. No usar APIs Babylon Lite como sustituto de Babylon.js.
6. Validar con [glTF Validator de Khronos](https://github.com/KhronosGroup/glTF-Validator), registrar versión y reporte; resolver errores, explicar warnings. Después importar en la versión Babylon fijada: validator no demuestra fidelidad ni rendimiento.
7. Comparar fuente y render del juego: escala, normales, UV, sombras, texturas, gestos y lectura. Capturar desde cámara real con asset ID y commit; medir coste frente al proxy. Sólo entonces aprobar.

Compresión Draco/Meshopt/KTX2 es candidata, no requisito: comprobar extensión admitida, decoder, coste de descarga y primera visualización, distribución local y fallback antes de decidir. Un GLB pequeño puede ocupar mucha memoria al descomprimirse; registrar ambos. El audio conserva fuente sin pérdida y export web compatible tras comprobar navegadores; normalizar niveles por escucha/medición, evitar picos, no añadir formatos duplicados sin utilidad.

## Entregable por asset

Fuente, export GLB/texturas o audio web, licencia/procedencia, informe técnico y captura en cámara de juego. Informe indica herramientas/versiones, geometría/UV/materiales/rig, peso, errores del validator, coste medido y decisión. Estados: candidato → derechos revisados → proxy → integrado → validado → aprobado. Cambiar licencia, textura o rig reabre validación. Ningún estado artístico de esta fase supera «propuesto».
