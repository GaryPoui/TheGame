import {uniform,type GameState} from '../game';
import {pokerDeck,POKER_SUITS,type PokerCard} from './poker-records';
export const HANDS=['high-card','pair','two-pair','three-kind','straight','flush','full-house','four-kind','straight-flush'] as const;
export type HandCategory=typeof HANDS[number];
export const HAND_NAMES:Record<HandCategory,string>={'high-card':'Carta alta',pair:'Pareja','two-pair':'Doble pareja','three-kind':'Trío',straight:'Escalera',flush:'Color','full-house':'Full house','four-kind':'Póker','straight-flush':'Escalera de color'};
export const HAND_POINTS:Record<HandCategory,number>={'high-card':2,pair:4,'two-pair':7,'three-kind':10,straight:14,flush:18,'full-house':24,'four-kind':32,'straight-flush':40};
export const HAND_HELP:Record<HandCategory,string>={'high-card':'Cinco cartas sin otra combinación.',pair:'Dos cartas del mismo valor.','two-pair':'Dos parejas de valores distintos.','three-kind':'Tres cartas del mismo valor.',straight:'Cinco valores seguidos; el as puede ir al principio o al final.',flush:'Cinco cartas del mismo palo.','full-house':'Un trío y una pareja.','four-kind':'Cuatro cartas del mismo valor.','straight-flush':'Cinco valores seguidos del mismo palo; incluye la escalera real.'};
export interface HandValue {category:HandCategory;tie:number[]}
type Rng=GameState['rng'];
export interface HoldemTable {player:PokerCard[];opponent:PokerCard[];board:PokerCard[];deck:PokerCard[];opponentChoice:HandCategory;opponentPoints:number;result?:{choice:HandCategory;player:HandValue;opponent:HandValue;winner:'player'|'opponent'|'tie';points:number;opponentAward:number}}
const rank=(c:PokerCard)=>c.rank===1?14:c.rank;
function straight(values:number[]):number {const v=new Set(values);if(v.has(14))v.add(1);for(let high=14;high>=5;high--)if([0,1,2,3,4].every(d=>v.has(high-d)))return high;return 0;}
/** Direct best-of-seven evaluator; tie vectors are the five-card poker tie breakers. */
export function evaluateHand(cards:readonly PokerCard[]):HandValue {
 const ranks=cards.map(rank).sort((a,b)=>b-a),counts=new Map<number,number>();for(const r of ranks)counts.set(r,(counts.get(r)??0)+1);
 const groups=[...counts].sort((a,b)=>b[1]-a[1]||b[0]-a[0]);
 const flush=POKER_SUITS.map(s=>cards.filter(c=>c.suit===s).map(rank).sort((a,b)=>b-a)).find(c=>c.length>=5);
 const sf=flush?straight(flush):0;if(sf)return {category:'straight-flush',tie:[sf]};
 const four=groups.find(g=>g[1]===4)?.[0];if(four)return {category:'four-kind',tie:[four,ranks.find(r=>r!==four)!]};
 const three=groups.find(g=>g[1]>=3)?.[0],pair=groups.filter(g=>g[1]>=2&&g[0]!==three).map(g=>g[0]).sort((a,b)=>b-a)[0];
 if(three&&pair)return {category:'full-house',tie:[three,pair]};
 if(flush)return {category:'flush',tie:flush.slice(0,5)};
 const run=straight(ranks);if(run)return {category:'straight',tie:[run]};
 if(three)return {category:'three-kind',tie:[three,...ranks.filter(r=>r!==three).slice(0,2)]};
 const pairs=groups.filter(g=>g[1]===2).map(g=>g[0]).sort((a,b)=>b-a);
 if(pairs.length>=2)return {category:'two-pair',tie:[...pairs.slice(0,2),ranks.find(r=>!pairs.slice(0,2).includes(r))!]};
 if(pairs.length)return {category:'pair',tie:[pairs[0]!,...ranks.filter(r=>r!==pairs[0]).slice(0,3)]};
 return {category:'high-card',tie:ranks.slice(0,5)};
}
export function compareHands(a:HandValue,b:HandValue):number {const category=HANDS.indexOf(a.category)-HANDS.indexOf(b.category);if(category)return category;for(let i=0;i<a.tie.length;i++)if(a.tie[i]!==b.tie[i])return a.tie[i]!-b.tie[i]!;return 0;}
/** The actual five cards, for a visible explanation of a seven-card showdown. */
export function bestFive(cards:readonly PokerCard[]):PokerCard[]{
 if(cards.length<5||cards.length>7)throw new Error('Expected five to seven cards');
 let best:PokerCard[]=[];let value:HandValue|undefined;
 for(let a=0;a<cards.length-4;a++)for(let b=a+1;b<cards.length-3;b++)for(let c=b+1;c<cards.length-2;c++)for(let d=c+1;d<cards.length-1;d++)for(let e=d+1;e<cards.length;e++){
  const candidate=[cards[a]!,cards[b]!,cards[c]!,cards[d]!,cards[e]!],v=evaluateHand(candidate);
  if(!value||compareHands(v,value)>0){best=candidate;value=v;}
 }
 return best;
}
const same=(a:PokerCard,b:PokerCard)=>a.rank===b.rank&&a.suit===b.suit;
/** Information available to this player only: six known cards, 46 possible rivers. */
export function handOdds(hole:readonly PokerCard[],board:readonly PokerCard[]){
 const known=[...hole,...board.slice(0,4)],counts=Object.fromEntries(HANDS.map(h=>[h,0])) as Record<HandCategory,number>;
 for(const river of pokerDeck().filter(c=>!known.some(k=>same(c,k))))counts[evaluateHand([...known,river]).category]++;
 return HANDS.map(category=>({category,count:counts[category],total:46}));
}
export function choosePrediction(hole:readonly PokerCard[],board:readonly PokerCard[]):HandCategory {return handOdds(hole,board).reduce((best,o)=>o.count*HAND_POINTS[o.category]>best.count*HAND_POINTS[best.category]?o:best).category;}
export function dealHoldem(rng:Rng,opponentPoints=0):{table:HoldemTable;rng:Rng}{
 const deck=pokerDeck(),dealt:PokerCard[]=[];for(let i=0;i<8;i++){const d=uniform(rng,deck.length);rng=d.rng;dealt.push(deck.splice(d.value,1)[0]!);}
 const player=dealt.slice(0,2),opponent=dealt.slice(2,4),board=dealt.slice(4);
 return {rng,table:{player,opponent,board,deck,opponentChoice:choosePrediction(opponent,board),opponentPoints}};
}
export function resolveHoldem(table:HoldemTable,rng:Rng,choice:HandCategory){
 const next=structuredClone(table),draw=uniform(rng,next.deck.length);next.board.push(next.deck.splice(draw.value,1)[0]!);
 const player=evaluateHand([...next.player,...next.board]),opponent=evaluateHand([...next.opponent,...next.board]),cmp=compareHands(player,opponent);
 const winner=cmp>0?'player':cmp<0?'opponent':'tie',points=winner==='player'&&player.category===choice?HAND_POINTS[choice]:0,opponentAward=winner==='opponent'&&opponent.category===next.opponentChoice?HAND_POINTS[next.opponentChoice]:0;
 next.opponentPoints+=opponentAward;next.result={choice,player,opponent,winner,points,opponentAward};return {table:next,rng:draw.rng};
}
