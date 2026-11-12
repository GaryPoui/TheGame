# Ada — generación de arte

Herramienta: generación integrada de imágenes de OpenAI, 2026-10-26. No se usó CLI ni API key.
Referencia de familia: `public/art/vera-v3.png`. Archivo final: `public/art/ada-v1.png`
en el repositorio (workspace original: `C:/Users/TomyG/Downloads/TheGame/public/art/ada-v1.png`).
Salida RGBA 1024×1536, alpha comprobado 0–254. Procedencia y hash en
[ada-art-v1.json](../public/ada-art-v1.json); su campo prompt resume el brief de producción.
No se declara CC0 ni una licencia general de redistribución.

## Prompt exacto enviado

Create a new production game character sprite, Ada the archivist, matching the attached reference image ONLY as an art direction reference for line weight, watercolor paper grain, restrained 1930s animation styling, muted plum/olive/cream/brass palette and soft warmth. Ada must be a distinct older female archivist, angular narrow silhouette, silver hair in tidy high bun, half-moon spectacles, one expressive raised eyebrow, dark plum long-sleeved dress with cream high collar, small brass brooch, ink-stained fingers holding a thick closed ledger against her chest and a wooden archive stamp in her other hand. Wry sympathetic expression, slightly eerie but calm, no evil grin. Three quarter view, looking at player, waist-up portrait, no desk. Strong ink silhouette, painted shadows and subtle paper texture, same visual family as the reference. Isolated on genuine transparent background, no backdrop, no glow or vignette outside silhouette, no lettering, no text, no signature, no extra objects. All hair, hands, ledger and stamp contained within image bounds with margin. This is a NEW character, not an edit of Vera.

Parámetros: `transparent_background=true`, referencia local de Vera. Se inspeccionó la imagen
antes de copiarla al proyecto; se comprobó el alpha con Pillow y se revisó su composición en UI.
