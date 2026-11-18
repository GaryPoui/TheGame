import {uniform} from '../game';
import type {RecordsState,RecordsChoice} from './records';

export type PokerSuit='hearts'|'diamonds'|'clubs'|'spades';
export interface PokerCard {rank:number;suit:PokerSuit}
export interface PokerTable {piles:[PokerCard[],PokerCard[]];last?:{pile:0|1;card:PokerCard;before:[PokerCard[],PokerCard[]]}}
export const POKER_SUITS:PokerSuit[]=['hearts','diamonds','clubs','spades'];
export const pokerDeck=():PokerCard[]=>POKER_SUITS.flatMap(suit=>Array.from({length:13},(_,i)=>({rank:i+1,suit})));
export const pokerRound=(s:RecordsState)=>s.round;
export const pokerTarget=(s:RecordsState)=>['una carta roja','un corazón','una figura: jota, reina o rey','una carta roja o un rey'][pokerRound(s)]!;
export function pokerMatches(card:PokerCard,round:number):boolean {
 const red=card.suit==='hearts'||card.suit==='diamonds';
 return round===0?red:round===1?card.suit==='hearts':round===2?card.rank>=11:red||card.rank===13;
}
const card=(rank:number,suit:PokerSuit):PokerCard=>({rank,suit});
/** Prepared subsets of one standard 52-card deck; every visible card is distinct. */
export function preparePoker(s:RecordsState):void {
 const h=(n:number)=>card(n,'hearts'),d=(n:number)=>card(n,'diamonds'),c=(n:number)=>card(n,'clubs'),p=(n:number)=>card(n,'spades');
 const examples:[PokerCard[],PokerCard[]][]=[
  [[h(1),d(3),h(7),d(11),c(4),p(9)],[h(5),d(8),c(2),p(6),c(10),p(13)]],
  [[h(2),h(6),c(8),p(12)],[h(4),h(9),h(10),h(13),p(5),d(7),c(11),p(13)]],
  [[h(11),c(12),d(13),p(2),h(5),c(8)],[d(11),p(12),h(1),c(3),d(6),p(10)]],
  [[h(2),d(6),c(13),p(13),c(4),p(9)],[h(4),d(8),c(2),p(5),c(10),p(12)]],
 ];
 const piles=structuredClone(examples[pokerRound(s)]!);
 if(s.variant==='repeat')piles.reverse();
 s.cards={piles};s.source='complete';s.observations=[];
}
export function pokerOdds(s:RecordsState,pile:0|1,before=false):{wins:number;total:number} {
 const cards=before&&s.cards?.last?s.cards.last.before[pile]:s.cards!.piles[pile];
 return {wins:cards.filter(c=>pokerMatches(c,pokerRound(s))).length,total:cards.length};
}
export function pokerBest(s:RecordsState):RecordsChoice[] {
 const a=pokerOdds(s,0),b=pokerOdds(s,1),delta=a.wins*b.total-b.wins*a.total;
 return delta>0?['K']:delta<0?['V']:['K','V'];
}
export function drawPoker(s:RecordsState,choice:RecordsChoice):void {
 const pile:0|1=choice==='K'?0:1,before=structuredClone(s.cards!.piles),cards=s.cards!.piles[pile];
 const draw=uniform(s.rng,cards.length);
 s.rng=draw.rng;const [drawn]=cards.splice(draw.value,1);
 s.cards!.last={pile,card:drawn!,before};
}
