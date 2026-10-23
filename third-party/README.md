# Licencias y procedencia

No se concede aquí una licencia general al código o documentación propios: decisión del titular
pendiente. Los componentes de terceros mantienen sus licencias originales.

Actualización visual 2026-10-23: se usan entorno y ropa originales, tonos sintetizados, cabeza
anatómica derivada de MakeHuman, piel de OnlyTheGhosts y materiales/HDR de Poly Haven, estos últimos CC0.
No se distribuyen tipografías. Procedencia y hashes: `docs/realistic-assets.json`; fuentes/licencias
conservadas en `makehuman/` y `polyhaven/`. El manifiesto de recursos está en `public/asset-manifest.json`;
la build incluye LICENSE y NOTICE completos de Babylon.js y una página de créditos. Los paquetes
de runtime sí se instalaron mediante npm ci en esta fase de implementación.

| Material integrado o fijado | Origen y licencia | Evidencia |
| --- | --- | --- |
| 17 skills revisadas | 4 repositorios, Apache-2.0/MIT según archivo | skills-manifest.json y LICENSE/ LICENSE.upstream por carpeta |
| Spec Kit generado | github/spec-kit v1.2.3, MIT | spec-kit/LICENSE y docs/evidence/specify-init.txt |
| Babylon core/loaders instalados como runtime | Apache-2.0 | package-lock y docs/evidence/npm-versions.json |
| TypeScript y Playwright fijados | Apache-2.0 | mismos registros npm |
| Vite y Vitest fijados | MIT | mismos registros npm |

Los recursos documentales que no figuran en el manifiesto integrado siguen siendo candidatos.
No reproducir recursos encontrados por enlace sin revisar
permiso por archivo. El pipeline define registro de origen, autor, licencia, modificaciones,
hash, fuente editable y salida GLB. No confundir licencia del código de un sitio con sus assets.
