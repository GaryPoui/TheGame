import './poker-records.css';
import {adaTableStage} from './ada-table';
import {decisionTrack} from './table-experience';
import {bestRecords,type RecordsState,type RecordsChoice} from '../core/tables/records';
import {pokerMatches,pokerOdds,pokerTarget,pokerRound,type PokerCard} from '../core/tables/poker-records';

const suits={hearts:{symbol:'♥',name:'corazones'},diamonds:{symbol:'♦',name:'diamantes'},clubs:{symbol:'♣',name:'tréboles'},spades:{symbol:'♠',name:'picas'}};
export const pokerCardName=(card:PokerCard)=>`${['','as','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','jota','reina','rey'][card.rank]} de ${suits[card.suit].name}`;
function cardView(card:PokerCard,matched=false):string {
 const suit=suits[card.suit],rank=card.rank===1?'A':card.rank===11?'J':card.rank===12?'Q':card.rank===13?'K':card.rank;
 return `<span class="poker-card ${card.suit==='hearts'||card.suit==='diamonds'?'red-card':''} ${matched?'poker-match':''}" role="img" aria-label="${pokerCardName(card)}"><b>${rank}</b><span aria-hidden="true">${suit.symbol}</span></span>`;
}
const button=(id:string,label:string,revision:number,disabled=false)=>`<button class="primary full" data-testid="${id}" data-revision="${revision}" ${disabled?'disabled':''}>${label}</button>`;
function pilesView(s:RecordsState,selected:RecordsChoice|null):string {
 const review=s.phase==='feedback',piles=review?s.cards!.last!.before:s.cards!.piles;
 return `<div class="poker-piles" aria-label="Cartas de los dos montones">${piles.map((pile,i)=>`<section class="poker-pile ${selected===(i===0?'K':'V')?'poker-selected':''}" aria-label="Montón ${i+1}"><h2>Montón ${i+1} <small>${pile.length} cartas</small></h2><div class="poker-hand">${pile.map(card=>cardView(card,review&&pokerMatches(card,pokerRound(s)))).join('')}</div></section>`).join('')}</div>`;
}
function pokerTutorial(s:RecordsState,step:number):string {
 const page=Math.max(0,Math.min(2,step)),example=structuredClone(s);
 const before=[pokerOdds(s,0),pokerOdds(s,1)];
 const best:0|1=before[0]!.wins*before[1]!.total>=before[1]!.wins*before[0]!.total?0:1;
 if(page===2){const pile=example.cards!.piles[best];pile.splice(pile.findIndex(c=>pokerMatches(c,0)),1);}
 const odds=[pokerOdds(example,0),pokerOdds(example,1)];
 const pages=[
  ['Reconocé los colores','Corazones ♥ y diamantes ♦ son rojos. Tréboles ♣ y picas ♠ son negros. No necesitás saber jugar al póker.','Cada montón usa algunas cartas de una baraja de 52, sin comodines. Todas las cartas que ves pueden salir.'],
  ['Elegí la mayor proporción',`Buscamos una roja. El montón ${best+1} tiene más cartas rojas en proporción a su total. Compará las cuentas de abajo.`, 'Dividí las cartas que sirven por todas las cartas del montón. Elegir mejor aumenta las chances; no asegura la carta.'],
  ['Actualizá después de sacar',`En este ejemplo retiramos una roja del montón ${best+1}. Hay una roja menos y una carta menos en total.`, 'La carta no vuelve. Antes de elegir otra vez, contá lo que queda. En la partida ganás puntos por elegir bien, aunque salga otro color.'],
 ];
 const content=pages[page]!;
 return `<main class="archive-layout ada-table-layout poker-layout poker-tutorial"><section class="archive-floor"><h1>Las cartas de Ada</h1><p data-testid="records-tutorial-step">Tutorial · paso ${page+1} de 3</p>${adaTableStage(pilesView(example,null))}</section><aside class="game-panel archive-panel"><h2>${content[0]}</h2><p>${content[1]}</p>${page>0?`<div class="tutorial-accounts" aria-label="Cuentas del ejemplo">${odds.map((o,i)=>`<p>Montón ${i+1}: <strong>${o.wins} ÷ ${o.total}</strong> rojas</p>`).join('')}</div>`:''}<p>${content[2]}</p><p class="small-note">Ejemplo preparado · no cambia tu progreso</p>${page<2?button('records-tutorial-next','Continuar tutorial',s.revision):button('records-begin','Jugar con Ada',s.revision)}${page>0?'<button class="text-button full" data-testid="records-tutorial-back">Volver al paso anterior</button>':''}${page<2?'<button class="text-button full" data-testid="records-begin">Saltar tutorial y jugar</button>':''}<button class="text-button full" data-testid="back-room">Volver a la sala</button></aside></main>`;
}
export function pokerRecordsView(s:RecordsState,selected:RecordsChoice|null,tutorialStep=0):string {
 if(s.phase==='tutorial')return pokerTutorial(s,tutorialStep);
 if(s.phase==='complete')return `<main class="completion-layout"><section class="completion-card" data-testid="records-completion"><div class="seal">III</div><h1>Ada te entrega su sello.</h1><p>${s.assisted?'Completaste los ejemplos con ayuda.':`${s.merit} buenas decisiones de ocho.`}</p><p>La carta que sale depende del azar. Tus puntos dependen de elegir con las mejores chances.</p>${button('enter-finale','Ir al contrato de salida',s.revision)}<button class="text-button full" data-testid="records-replay">Volver a jugar con cartas</button><button class="text-button full" data-testid="back-room">Volver a la sala</button></section></main>`;
 const review=s.phase==='feedback',last=s.history.at(-1),optimal=review?last!.optimal:bestRecords(s),draw=s.cards!.last;
 const odds=[pokerOdds(s,0,review),pokerOdds(s,1,review)];
 const verdict=review?`<section data-testid="records-feedback"><h3>${last!.correct?'✓ Buena elección.':'Había un montón con más chances.'}</h3><p>Antes de sacar: montón 1, ${odds[0]!.wins} de ${odds[0]!.total}; montón 2, ${odds[1]!.wins} de ${odds[1]!.total}.</p><p>Salió ${pokerCardName(draw!.card)}. ${pokerMatches(draw!.card,pokerRound(s))?'Cumpliste el objetivo.':'Esta vez no cumpliste el objetivo.'} La carta queda afuera.</p></section>`:'';
 return `<main class="archive-layout ada-table-layout poker-layout"><section class="archive-floor"><h1>Las cartas de Ada</h1><p>${s.assisted?`Con ayuda: ronda ${s.round+1} de dos`:`Ronda ${s.round+1} de cuatro`} · elección ${s.step+1} de dos</p><div class="scoreboard"><span>Buenas decisiones <strong data-testid="records-merit">${s.merit}/8</strong></span></div>${decisionTrack(s.history.filter(d=>d.assisted===s.assisted).map(d=>d.correct),s.assisted?4:8)}${adaTableStage(pilesView(s,review?last!.choice:selected))}</section><aside class="game-panel archive-panel"><h2>Buscá ${pokerTarget(s)}</h2><p>${s.step===0?'¿De qué montón conviene sacar?':'La carta anterior quedó afuera. ¿Qué montón conviene ahora?'}</p><div class="archive-options">${(['K','V'] as const).map((c,i)=>`<button class="archive-choice ${selected===c?'selected':''} ${review?optimal.includes(c)?'answer-correct':'answer-incorrect':''}" data-testid="records-${c}" aria-pressed="${selected===c}" ${review?'disabled':''}>${s.assisted&&optimal.includes(c)?'Ayuda: ':''}Montón ${i+1}</button>`).join('')}</div>${verdict}${review?button('records-next','Continuar',s.revision):button('records-confirm','Sacar una carta',s.revision,selected===null)}<details><summary>Cómo se juega</summary><p>Son cartas de una baraja de póker de 52 cartas, sin comodines. Cada ronda usa los montones preparados que ves. Todas las cartas de un montón tienen la misma posibilidad de salir.</p><p>Rojo: corazones y diamantes. Figuras: jota, reina y rey; el as no es figura. «Roja o rey» incluye ambas condiciones, sin contar dos veces un rey rojo.</p><p>Cada extracción retira una carta. Los montones se renuevan al empezar otra ronda. Ganás un punto por elegir la mayor proporción favorable, incluso si sale otra carta. Si los montones empatan, los dos sirven.</p></details><button class="text-button full" data-testid="back-room">Guardar y volver a la sala</button></aside></main>`;
}
