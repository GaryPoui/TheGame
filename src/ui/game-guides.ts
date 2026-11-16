import {HANDS,HAND_NAMES,HAND_POINTS,HAND_HELP,evaluateHand,compareHands,handOdds,type HandCategory,type HoldemTable} from '../core/tables/holdem';
import type {PokerCard} from '../core/tables/poker-records';
import {holdemFelt,pokerCardView} from './poker-cards';
import './game-guides.css';
export type Guide='urns'|'dice'|'poker'|'boss';
export const guideButton=(guide:Guide,label='Cómo jugar',start=0)=>`<button class="text-button full" data-guide="${guide}" data-guide-start="${start}">${label}</button>`;
const c=(rank:number,suit:PokerCard['suit']):PokerCard=>({rank,suit});
const samples:Record<HandCategory,PokerCard[]>={
 'high-card':[c(1,'spades'),c(11,'hearts'),c(8,'clubs'),c(5,'diamonds'),c(2,'clubs')],
 pair:[c(9,'hearts'),c(9,'spades'),c(1,'clubs'),c(6,'diamonds'),c(2,'clubs')],
 'two-pair':[c(9,'hearts'),c(9,'spades'),c(4,'clubs'),c(4,'diamonds'),c(1,'clubs')],
 'three-kind':[c(9,'hearts'),c(9,'spades'),c(9,'clubs'),c(6,'diamonds'),c(2,'clubs')],
 straight:[c(5,'hearts'),c(6,'spades'),c(7,'clubs'),c(8,'diamonds'),c(9,'clubs')],
 flush:[c(1,'hearts'),c(11,'hearts'),c(8,'hearts'),c(5,'hearts'),c(2,'hearts')],
 'full-house':[c(9,'hearts'),c(9,'spades'),c(9,'clubs'),c(4,'diamonds'),c(4,'clubs')],
 'four-kind':[c(9,'hearts'),c(9,'spades'),c(9,'clubs'),c(9,'diamonds'),c(1,'clubs')],
 'straight-flush':[c(5,'hearts'),c(6,'hearts'),c(7,'hearts'),c(8,'hearts'),c(9,'hearts')],
};
/** Ascending strength, with examples that use the same cards as the actual table. */
export function pokerHandGuide():string {
 return `<p>Las letras de las cartas: J es jota, Q es reina, K es rey y A es as. El as es el más alto; también puede empezar la escalera de as, dos, tres, cuatro y cinco.</p><p>Un palo es un símbolo: corazones ♥, diamantes ♦, tréboles ♣ o picas ♠. La mano llamada color necesita cinco del mismo palo; mezclar corazones y diamantes no sirve.</p>`+HANDS.map((h,i)=>`<section class="hand-reference"><h3>${i+1} de 9 · ${HAND_NAMES[h]}</h3><div class="poker-hand">${samples[h].map(card=>pokerCardView(card)).join('')}</div><p>${HAND_HELP[h]} <strong>${HAND_POINTS[h]} puntos</strong>.</p><p>${i===0?'La mano más baja.':`Supera a ${HAND_NAMES[HANDS[i-1]!].toLocaleLowerCase('es')}.`}</p></section>`).join('');
}
const lessons:Record<Exclude<Guide,'poker'>,readonly [string,string][]>={
 urns:[['Elegí la mejor proporción','Buscá el color del objetivo. Tres rojas entre cinco fichas dan 60 %. Una roja entre dos da 50 %. Conviene la primera, aunque puede salir azul.'],['Mirá qué cambió','Si devolvemos la ficha, la proporción sigue igual. Si queda afuera, contá de nuevo antes de elegir: cambian tanto el color extraído como el total.'],['Cómo conseguís el sello','Sumás un punto por elegir una de las mejores urnas, aunque salga otro color. Necesitás seis buenas decisiones de ocho. Las fichas ganadas muestran la suerte; no compran el sello. Si hace falta, hay una práctica con ayuda.']],
 dice:[['Leé el objetivo antes de firmar','Seguro deja dos fichas siempre. Centro deja cinco si la suma es 6, 7 u 8; si no, perdés una. Justo siete deja 23 con suma 7; si no, perdés una. Estos valores ya descuentan el coste.'],['Promedio no es garantía','Justo siete deja tres fichas por tirada en promedio si lo repetís muchas veces, pero puede perder en una tirada. Seguro garantiza dos. Si el objetivo pide al menos cuatro, Centro ofrece más posibilidades: 16 de 36 pares.'],['Dos decisiones por ronda','Primero firmás y tirás. Después cambia el objetivo: elegís para una tirada imaginaria, sin cobrar ni pagar. El sello pide seis buenas decisiones de ocho, no un saldo alto. Podés seguir con ayuda si lo necesitás.']],
 boss:[['Una buena decisión también golpea','Bajá la resistencia de 36 a cero. Elegir la opción con mejor cuenta hace dos de daño, incluso con mala suerte. Elegir una inferior gasta una de tus seis defensas. No hay reloj.'],['Cargá y descargá el combo','Una ficha del color pedido carga uno; una tirada favorable carga dos. Podés guardar hasta seis. En póker, acertar tu categoría exacta y ganar convierte sus puntos en daño y suma la carga. Por ejemplo: pareja de cuatro puntos + tres de combo = siete de daño, además de dos si tu elección fue óptima.'],['Cómo comparar en póker','Compará cuántas cartas completan cada categoría y el daño que paga. Con combo tres: pareja paga siete y trío paga trece. Si hay 30 cartas para pareja y dos para trío, compará 30 × 7 = 210 con 2 × 13 = 26. Elegir pareja es mejor en ese ejemplo; no garantiza ganar el duelo.'],['El orden cambia, el progreso queda','Cada asalto combina urnas, dados y póker en otro orden. En urnas sacás dos veces sin devolver. Si agotás las defensas o seis asaltos, podés reintentar o completar las tres mecánicas con ayuda. Conservás los sellos.']],
};
const demo=():HoldemTable=>({player:[c(13,'spades'),c(13,'hearts')],opponent:[c(1,'hearts'),c(12,'spades')],board:[c(13,'clubs'),c(2,'diamonds'),c(7,'clubs'),c(9,'hearts')],deck:[],opponentChoice:'pair',opponentPoints:0});
function bossExample(page:number):string {
 const examples=[['Buena decisión','+2 de daño','Mala suerte','No pierde defensa'],['Urna +1','Dados +2','Combo guardado','3 de 6'],['Pareja + combo','4 + 3 = 7 de daño','Buena decisión','+2 adicionales'],['Sin defensas','Reintentar o pedir ayuda','Tus tres sellos','Se conservan']];
 const e=examples[page]!;return `<div class="guide-example" aria-label="Ejemplo del duelo"><span>${e[0]}<strong>${e[1]}</strong></span><span>${e[2]}<strong>${e[3]}</strong></span></div>`;
}
type Show=(title:string,html:string,kind:string)=>HTMLDialogElement;
/** Prepared teaching data only: no commands, save writes or campaign RNG. */
export function installGameGuides(show:Show):void {
 document.addEventListener('click',event=>{
  const trigger=(event.target as HTMLElement).closest<HTMLElement>('[data-guide]');
  const kind=trigger?.dataset.guide as Guide|undefined;
  if(!kind||!['urns','dice','poker','boss'].includes(kind))return;
  const dialog=show(kind==='poker'?'Una mano con Ada':'Cómo jugar', '<div class="guide-content"></div>','guide-modal');
  const body=dialog.querySelector<HTMLElement>('.guide-content')!;
  let page=kind==='boss'?Math.max(0,Math.min(3,Number(trigger?.dataset.guideStart)||0)):0,choice:HandCategory|null=null,revealed=false;
  const draw=()=>{
   if(kind==='poker'){
    const t=demo();if(revealed)t.board.push(c(2,'clubs'));
    const player=evaluateHand([...t.player,...t.board]),opponent=evaluateHand([...t.opponent,...t.board]);
    const hit=choice===player.category,win=compareHands(player,opponent)>0;
    const odds=handOdds(t.player,demo().board).filter(o=>o.count>0);
    body.innerHTML=`<p class="guide-caption">Ejemplo preparado · sin puntos ni cambios en tu partida</p>${holdemFelt(t,revealed)}${revealed?`<section class="guide-result" role="status"><h3>${hit&&win?`Acertaste: ${HAND_POINTS[player.category]} puntos en una partida real`:'Esta elección no daría puntos'}</h3><p>${hit?'Acertaste full house.':`Elegiste ${HAND_NAMES[choice!]}; salió full house: trío de reyes y pareja de doses.`} Tu full house supera la pareja de Ada. ${hit?'Se cumplen las dos condiciones: acertar y ganar.':'Ganar con una categoría distinta no alcanza.'}</p></section><button class="secondary full" data-demo-reset>Probar otra predicción</button>`:`<p>Tenés dos reyes y otro en la mesa: ya hay un trío. Elegí qué categoría exacta tendrás cuando aparezca la quinta carta.</p><div class="demo-choices">${odds.map(o=>`<button class="secondary ${choice===o.category?'selected':''}" aria-pressed="${choice===o.category}" data-demo-choice="${o.category}">${HAND_NAMES[o.category]}<small>${o.count} de 46 cartas</small></button>`).join('')}</div><button class="primary full" data-demo-reveal ${choice===null?'disabled':''}>Revelar la quinta carta</button>`}`;
   }else{
    const pages=lessons[kind],lesson=pages[page]!;
    body.innerHTML=`<p class="guide-caption">${page+1} de ${pages.length}</p><h3 tabindex="-1">${lesson[0]}</h3><p>${lesson[1]}</p>${kind==='boss'?bossExample(page):''}<nav class="reading-nav" aria-label="Pasos del tutorial"><button class="secondary" data-guide-page="previous" ${page===0?'disabled':''}>Anterior</button><span role="status">${page+1} de ${pages.length}</span><button class="primary" data-guide-page="next" ${page===pages.length-1?'disabled':''}>Siguiente</button></nav>`;
   }
  };
  dialog.addEventListener('click',e=>{
   const button=(e.target as HTMLElement).closest<HTMLButtonElement>('button');if(!button||button.disabled)return;
   if(button.dataset.demoChoice){choice=button.dataset.demoChoice as HandCategory;draw();body.querySelector<HTMLButtonElement>(`[data-demo-choice="${choice}"]`)?.focus({preventScroll:true});}
   if(button.hasAttribute('data-demo-reveal')&&choice){revealed=true;draw();body.querySelector<HTMLElement>('.guide-result')?.setAttribute('tabindex','-1');body.querySelector<HTMLElement>('.guide-result')?.focus({preventScroll:true});}
   if(button.hasAttribute('data-demo-reset')){choice=null;revealed=false;draw();body.querySelector<HTMLButtonElement>('[data-demo-choice]')?.focus({preventScroll:true});}
   if(button.dataset.guidePage&&kind!=='poker'){page=Math.max(0,Math.min(lessons[kind].length-1,page+(button.dataset.guidePage==='next'?1:-1)));draw();body.querySelector<HTMLElement>('h3')?.focus({preventScroll:true});}
  });
  draw();
 });
}
