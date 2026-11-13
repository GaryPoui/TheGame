import {bestFive,type HoldemTable,HAND_NAMES} from '../core/tables/holdem';
import type {PokerCard} from '../core/tables/poker-records';
const symbols={hearts:'♥',diamonds:'♦',clubs:'♣',spades:'♠'};
const names={hearts:'corazones',diamonds:'diamantes',clubs:'tréboles',spades:'picas'};
export const pokerRankName=(n:number)=>n===1||n===14?'as':n===11?'jota':n===12?'reina':n===13?'rey':String(n);
export function pokerCardView(c?:PokerCard,highlight=false,river=false):string {
 if(!c)return '<span class="poker-card card-back" role="img" aria-label="Carta boca abajo"><span aria-hidden="true">✧</span></span>';
 return `<span class="poker-card ${['hearts','diamonds'].includes(c.suit)?'red-card':''} ${highlight?'best-card':''} ${river?'river-card':''}" role="img" aria-label="${river?'Quinta carta: ':''}${pokerRankName(c.rank)} de ${names[c.suit]}${highlight?', parte de tu mejor mano':''}"><b>${c.rank===1?'A':c.rank===11?'J':c.rank===12?'Q':c.rank===13?'K':c.rank}</b><span aria-hidden="true">${symbols[c.suit]}</span></span>`;
}
export function holdemFelt(t:HoldemTable,review:boolean,opponent='Ada'):string {
 const best=review?bestFive([...t.player,...t.board]):[],marked=(c:PokerCard)=>best.some(b=>b.rank===c.rank&&b.suit===c.suit);
 return `<div class="holdem-felt"><section class="holdem-opponent"><h2>${opponent} ${review?`· eligió ${HAND_NAMES[t.opponentChoice]}`:'· elección guardada'}</h2><div class="poker-hand" data-testid="opponent-cards">${t.opponent.map(c=>pokerCardView(review?c:undefined)).join('')}</div></section><section class="holdem-board"><h2>${review?'Quinta carta revelada':'Cartas de la mesa'}</h2><div class="poker-hand" data-testid="community-cards">${t.board.map((c,i)=>pokerCardView(c,marked(c),i===4)).join('')}${t.board.length===4?pokerCardView():''}</div></section><section class="holdem-player"><h2>Tus cartas${review?' · tu mejor mano está marcada':''}</h2><div class="poker-hand" data-testid="player-cards">${t.player.map(c=>pokerCardView(c,marked(c))).join('')}</div></section></div>`;
}
export function showdownHands(t:HoldemTable):string {
 return `<div class="showdown-hands" aria-label="Las cinco cartas de cada mano">${([['Vos',t.player],['Rival',t.opponent]] as const).map(([label,hole])=>`<section><h3>${label}</h3><div class="poker-hand">${bestFive([...hole,...t.board]).map(c=>pokerCardView(c)).join('')}</div></section>`).join('')}</div>`;
}
