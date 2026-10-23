# Validación del MVP de urnas

Fecha de ejecución: 2026-10-23, America/Buenos_Aires. Alcance: primer capítulo, una mesa completa;
no certifica las mesas de contratos, registros ni el final de campaña.

## Entorno y reproducción

Windows 10 Home 10.0.19045, AMD Ryzen 7 3700X, Radeon RX 570, 15.9 GiB RAM.
Chromium Playwright 156.0.8078.4, ventana principal 1440×900, revisión adicional 1280×720.
La automatización usa WebGL2 con ANGLE SwiftShader, renderizado por software: el equipo identificado
no implica que estas pruebas midan el rendimiento de la GPU Radeon.

Ejecutar `npm ci`, `npm run build` y mantener `npm run preview` abierto. En otra terminal:
`npm run test:browser` y `node scripts/capture-mvp.mjs`. La variable `PLAYWRIGHT_BASE_URL` permite
repetirlas sobre el sitio publicado; usar URL terminada en `/`. El reporte JSON completo de tests
se genera en `test-results/browser-results.json`. Las capturas persistentes y su inventario de
errores, peticiones y contexto gráfico están en [evidencia runtime](evidence/runtime/capture.json).

## Cobertura

- Cuatro rondas y ocho decisiones óptimas: sello independiente, mérito 8/8 e historial de ocho acciones.
- Recarga tras revelar: resultado, inventario, mérito e identidad/contador del RNG conservados.
- Movimiento reducido, texto 200 %, audio a cero y selección/confirmación mediante teclado.
- Decisiones débiles seguidas de dos escenarios guiados: final asistido acotado y doce acciones.
- Conflicto de atajos rechazado, reasignación efectiva y ayuda sin consumir azar ni alterar progreso.
- Guardado truncado: menú utilizable y sin presentar una continuación inválida.
- WebGL no disponible: aviso y reintento, con una extracción jugable mediante los controles HTML.
- Reemplazar ajustes por otro diálogo no lo elimina: restaurar ajustes y cancelar borrado conservan el flujo y el guardado.

La suite ejercita el build estático de producción, no el servidor de desarrollo. La ejecución
completa aprobó siete pruebas en aproximadamente 80 s; la regresión adicional de diálogos aprobó
una prueba en 12.1 s contra el último build. Reportes:
[suite de siete casos](evidence/runtime/browser-suite.json) y
[regresión de diálogos](evidence/runtime/browser-modal-regression.json).
Durante la ampliación hubo dos fallos de sincronización del test al usar teclado antes del evento
asíncrono de cierre de diálogo; se corrigió la espera por eliminación del modal y se repitió la
suite completa. No se omitieron los casos fallidos. La revisión del código encontró además una
carrera real al reemplazar diálogos; la regresión adicional verifica su corrección.

## Revisión visual y límites

Se inspeccionaron capturas reales del menú, tutorial, mesa y revelación. La escena contiene a Vera,
dos urnas y objetos de mesa renderizados; el panel ofrece conteos, fracciones, porcentajes, símbolos
y reglas de reposición. No se considera suficiente la mera presencia del elemento canvas.
La captura a texto 200 % usa desplazamiento dentro del panel; la prueba de teclado confirma que
una extracción sigue siendo accesible con la escala aumentada.

Las imágenes se revisan manualmente; no hay comparación píxel a píxel ni afirmación de contraste
WCAG completo. No se han probado lectores de pantalla, todas las combinaciones de zoom del navegador,
dispositivos móviles, pérdida real y restauración del contexto, ni todos los navegadores.
Tras separar las fichas en la escena, la captura de U1 permitió distinguir tres triángulos rojos
y dos círculos azules en U, y uno de cada tipo en V, coherentes con el inventario HTML. Esto valida
ese plano de referencia; los demás estados y configuraciones siguen sujetos a revisión contextual.

No se midieron todavía carga con red limitada, mediana/p95 de frame time, memoria estable de campaña,
diversión, duración objetivo ni aprendizaje con participantes. Los presupuestos del plan original
siguen siendo objetivos y la experiencia de 30–45 minutos corresponde a la campaña futura.

## Skills aplicadas

Se leyó y aplicó `.agents/skills/webapp-testing/SKILL.md`: reconocer DOM después de cargar,
usar selectores estables, capturar errores y pantallas, y comprobar canvas aparte de controles DOM.
Se usa Playwright TypeScript por integración con las dependencias y el runner fijados del proyecto;
no se ejecutaron los auxiliares Python ni se agregaron dependencias para duplicar ese runner.

## Hosting

La consulta de Pages inicial devolvió 404: aún no existía sitio configurado. El repositorio era
público, el acceso autenticado tenía permisos administrativos y Actions estaba habilitado.
La ruta seleccionada es build local validado → rama nueva `gh-pages` → GitHub Pages por HTTPS,
sin fusionar la rama de implementación a `main`. Sólo la publicación comprobada autoriza registrar
la URL como disponible; la captura local por sí sola no demuestra despliegue.

Fuentes verificadas: [API de Pages](https://docs.github.com/en/rest/pages/pages) y
[configuración del origen](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
