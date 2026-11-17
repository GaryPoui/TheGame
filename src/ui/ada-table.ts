/** The shared table canvas is mounted in the viewport; photos remain native HTML. */
export function adaTableStage(evidence:string,comparison=false,host:'ada'|'captor'='ada',dock=false):string {
 const reading=`<div class="ada-evidence">${evidence}</div>`;
 return `<section class="ada-table-stage ${comparison?'ada-comparison':''} ${dock?'casino-stage':''}" aria-label="${host==='ada'?'Mesa de Ada':'Mesa del anfitrión'}"><div class="ada-viewport" data-testid="ada-viewport"><img class="ada-fallback-portrait" src="${import.meta.env.BASE_URL}art/${host==='ada'?'ada-v1.png':'captor-v3.png'}" alt="" aria-hidden="true"><div class="ada-table-fallback" aria-hidden="true"></div></div>${dock?'':reading}</section>${dock?reading:''}`;
}
