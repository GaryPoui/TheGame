/** The shared table canvas is mounted in the viewport; photos remain native HTML. */
export function adaTableStage(evidence:string,comparison=false):string {
 return `<section class="ada-table-stage ${comparison?'ada-comparison':''}" aria-label="Mesa de fotos de Ada"><div class="ada-viewport" data-testid="ada-viewport"><img class="ada-fallback-portrait" src="${import.meta.env.BASE_URL}art/ada-v1.png" alt="" aria-hidden="true"><div class="ada-table-fallback" aria-hidden="true"></div></div><div class="ada-evidence">${evidence}</div></section>`;
}
