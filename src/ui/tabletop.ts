export type TableKind = 'urns' | 'contracts' | 'records' | 'finale';

/** Original code-drawn desk props: decorative, never invented evidence or extra choices. */
export function tableProps(kind: TableKind): string {
  return `<div class="desk-props desk-props-${kind}" aria-hidden="true"><span class="desk-pen"></span><span class="desk-ink"></span>${kind === 'records' ? '<span class="desk-folders"><i></i><i></i><i></i></span><span class="desk-stamp"></span>' : kind === 'contracts' ? '<span class="desk-chips"><i></i><i></i><i></i></span><span class="desk-slip"></span>' : kind === 'finale' ? '<span class="desk-cards"><i>♠</i><i>♦</i><i>♣</i></span><span class="desk-stamp"></span>' : '<span class="desk-scoop"></span><span class="desk-slip"></span>'}</div>`;
}

export function sceneSlot(label: string): string {
  return `<div class="table-scene-slot" data-table-scene aria-label="${label}"><span class="scene-fallback">${label}. También podés jugar con las opciones de abajo.</span></div>`;
}

export function tabletop(kind: TableKind, content: string, caption: string): string {
  const portrait = {urns:'vera-v3.png',contracts:'doble-v2.png',records:'ada-v1.png',finale:'captor-v3.png'}[kind];
  const name = {urns:'Vera',contracts:'Doble',records:'Ada',finale:'El anfitrión'}[kind];
  return `<div class="tabletop tabletop-${kind}" data-testid="tabletop-${kind}"><div class="table-host"><img src="${import.meta.env.BASE_URL}art/${portrait}" alt=""><span>${name}</span></div><div class="tabletop-rim"><div class="tabletop-felt">${tableProps(kind)}<div class="tabletop-content">${content}</div><p class="tabletop-caption">${caption}</p></div></div></div>`;
}
