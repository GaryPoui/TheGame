import {dieFace} from './dice-face';

/** The existing WebGL canvas is mounted here; HTML also works without WebGL. */
export function diceTable(pair:readonly [number,number]|null,rolling:boolean,previous:boolean):string {
 const visible=rolling?null:pair;
 const caption=rolling?'Tirando los dados…':visible?`${previous?'Tirada anterior · ':''}Dado 1: ${visible[0]} · Dado 2: ${visible[1]} · Suma ${visible[0]+visible[1]}`:'Elegí una oferta. Los dados se tiran al firmar.';
 return `<section class="dice-table ${rolling?'is-rolling':''}" aria-label="Mesa de dados de Doble" data-testid="dice-table"><div class="dice-viewport" data-testid="dice-viewport"><div class="dice-table-fallback" aria-hidden="true"><div class="dice-pair">${dieFace(visible?.[0]??null,'D1')}${dieFace(visible?.[1]??null,'D2')}</div></div></div><p class="dice-table-caption" role="status" data-testid="dice-status">${caption}</p></section>`;
}
