# Publicación estática del MVP

Autorización: el usuario pidió «hasta llegar a un mvp y luego hostealo», 2026-10-23.
Destino: GitHub Pages del mismo repositorio público, sin servicios pagos ni backend. La versión
visual del MVP se trabaja en `codex/realistic-visuals`, con PR sobre `codex/playable-mvp`.

La build se valida localmente antes de copiarla a una rama `gh-pages` independiente. Pages sirve
esa rama desde `/`. El código fuente y documentación se conservan en la rama de trabajo y su PR;
no hace falta fusionar main para alojar una build revisada. No se fuerza historia.

## Preparar y verificar

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run preview
npm run test:browser
```

Pruebas de navegador requieren Chromium Playwright: `npx playwright install chromium` si no está
instalado. La instalación comprobada de esta máquina ya lo tenía. Preview sirve puerto 4173,
origen de PLAYWRIGHT_BASE_URL por defecto. Base Vite relativa `./` permite raíz y `/TheGame/`.

## Publicar una build verificada

Usar `scripts/publish-pages.ps1`; requiere Git y gh autenticado con acceso al repositorio.
El script verifica dist, clona únicamente la rama gh-pages en carpeta temporal si ya existe o
crea rama nueva si no existe, copia sólo la build revisada y conserva historial existente.
El directorio temporal no contiene credenciales. No se sube `.env`, node_modules, código del
agente ni documentos privados: únicamente dist y `.nojekyll`.

En la primera publicación configurar Pages vía API con `source.branch=gh-pages`, `source.path=/`
y `build_type=legacy`. El script no configura permisos nuevos ni toca otras ramas. Revisar estado
de build Pages y abrir HTTPS desde navegador; respuesta 200 de HTML sola no demuestra juego funcional.
Ejecutar smoke/playthrough contra URL pública y registrar SHA de build, fuente, fecha y resultado.

Rollback: seleccionar commit previo de gh-pages y publicar sus archivos en un commit nuevo.
No usar force push. El guardado local depende del origen, por lo que preview y URL pública tienen
progresos separados. No hay analíticas ni tráfico externo requerido para jugar.

## Entrega publicada y comprobada

URL: https://garypoui.github.io/TheGame/ (HTTPS obligatorio). Fuente `52bc021a9f1730de3fa64567c0c3871af604e33e`,
commit de rama estática `c1db9d9ad2c5e38f6d1084cc9fbdc8c71c09bf61`. Pages informa built y responde 200.
Se completaron dos pruebas públicas y se cotejaron los 63 archivos con SHA256 de la build.
Evidencia: docs/evidence/runtime/public-browser.json, public-smoke.json y public-integrity.json.
La licencia copiada del paquete tenía CRLF; Git conserva LF en el repositorio. Se normalizó la
copia local de licencia a LF antes de cotejar los hashes; el texto es idéntico. Para publicaciones
futuras el script conserva bytes compilados con .gitattributes -text en rama estática.
