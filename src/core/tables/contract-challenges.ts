import {CONTRACTS,DICE_PAIRS,type ContractId,type DicePair,type ObjectiveId} from '../math/dice';
import type {ContractsState} from './contracts';
export interface ChallengeOffer {id:ContractId;name:string;cost:number;gross:number;rule:readonly string[];gate:'any'|'center'|'seven'|'low'|'high'|'doubles'|'even'|'odd'|'edge'|'stepped'|'sum'}
const offer=(id:ContractId,name:string,cost:number,gross:number,gate:ChallengeOffer['gate'],...rule:string[]):ChallengeOffer=>({id,name,cost,gross,gate,rule});
const sets:readonly ChallengeOffer[][]=[
 [offer('S','Seguro',0,2,'any','Ganás 2 siempre'),offer('C','Centro',1,6,'center','Ganás 5 si suman 6, 7 u 8','Si no, perdés 1'),offer('J',CONTRACTS.J.name,1,24,'seven','Ganás 23 si suman 7','Si no, perdés 1')],
 [offer('S','Bajo',1,6,'low','Ganás 5 si suman 5 o menos','Si no, perdés 1'),offer('C','Alto',1,6,'high','Ganás 5 si suman 9 o más','Si no, perdés 1'),offer('J','Dobles',1,10,'doubles','Ganás 9 si los dados son iguales','Si no, perdés 1')],
 [offer('S','Par',1,6,'even','Ganás 5 si la suma es par','Si no, perdés 1'),offer('C','Impar',2,7,'odd','Ganás 5 si la suma es impar','Si no, perdés 2'),offer('J','Extremos',3,20,'edge','Ganás 17 si suman 2 o 12','Si no, perdés 3')],
 [offer('S','Acotado',1,4,'stepped','Ganás 3 si suman 7 o menos','Ganás 1 si suman 8 o más'),offer('C','Creciente',2,0,'sum','Ganás la suma de los dados menos 2','Si suman 6, ganás 4'),offer('J','Encuentro',3,12,'doubles','Ganás 9 si los dados son iguales','Si no, perdés 1')],
];
export function challengeOffers(s:ContractsState):readonly ChallengeOffer[]{return sets[s.round]!;}
export function challengeNet(s:ContractsState,id:ContractId,pair:DicePair):number {
 const o=challengeOffers(s).find(o=>o.id===id)!,sum=pair[0]+pair[1];
 const hit=o.gate==='any'||o.gate==='center'&&sum>=6&&sum<=8||o.gate==='seven'&&sum===7||o.gate==='low'&&sum<=5||o.gate==='high'&&sum>=9||o.gate==='doubles'&&pair[0]===pair[1]||o.gate==='even'&&sum%2===0||o.gate==='odd'&&sum%2===1||o.gate==='edge'&&(sum===2||sum===12);
 const gross=o.gate==='sum'?sum:o.gate==='stepped'?sum<=7?4:2:hit?o.gross:s.round===3&&id==='J'?2:0;
 return gross-o.cost;
}
export function challengeTask(s:ContractsState){
 const second=s.phase==='order'||s.phase==='review',index=s.round*2+(second?1:0),first=s.pair?.[0]??1;
 const tasks:{id:string;title:string;explanation:string;objective:ObjectiveId;metric:'mean'|'reach'|'interval'|'worst'|'range';threshold?:number}[]=[
  {id:'long-run',title:'Si tirás muchas veces, ¿qué oferta deja más en promedio?',explanation:'Imaginá que sale una vez cada uno de los 36 pares. Sumá las ganancias, restá las pérdidas y repartí el total entre 36.',objective:'expected',metric:'mean'},
  {id:'four-after-cost',title:'¿Con cuál es más fácil ganar 4 fichas o más?',explanation:'Contá cuántas tiradas te dejan 4 fichas o más con cada oferta.',objective:'atLeast4',metric:'reach',threshold:4},
  {id:'within-budget',title:'¿Con cuál es más fácil ganar de 2 a 6 fichas?',explanation:'Sólo sirven las tiradas que dejan 2, 3, 4, 5 o 6 fichas.',objective:'atLeast4',metric:'interval'},
  {id:'known-first',title:`Si el primer dado es ${first}, ¿con cuál es más fácil ganar 4 fichas o más?`,explanation:'Usá ese número en el primer dado. Probá del 1 al 6 en el segundo y contá cuántas veces llegás a 4 fichas.',objective:'atLeast4',metric:'reach',threshold:4},
  {id:'worst-case',title:'Si todo sale mal, ¿con cuál perdés menos?',explanation:'Mirá cuántas fichas perderías en el peor resultado de cada oferta.',objective:'guarantee1',metric:'worst'},
  {id:'ordered-dice',title:'Si el segundo dado es mayor, ¿cuál deja más en promedio?',explanation:'Contá sólo pares como 2 y 5, en ese orden. Hay 15 en total. Sumá lo que te dejan y dividí por 15.',objective:'expected',metric:'mean'},
  {id:'smallest-spread',title:'¿Qué oferta cambia menos entre su mejor y su peor resultado?',explanation:'Restá el peor resultado al mejor. Por ejemplo, entre ganar 3 y ganar 1 hay 2 fichas de diferencia.',objective:'range',metric:'range'},
  {id:'six-first',title:'Si el primer dado es 6, ¿cuál deja más en promedio?',explanation:'Probá del 1 al 6 en el segundo dado. Sumá lo que te deja cada resultado y dividí por 6.',objective:'expected',metric:'mean'},
 ];return tasks[index]!;
}
export function challengeSamples(s:ContractsState):readonly DicePair[]{
 const id=challengeTask(s).id;
 return DICE_PAIRS.filter(p=>id==='known-first'?p[0]===(s.pair?.[0]??1):id==='ordered-dice'?p[1]>p[0]:id==='six-first'?p[0]===6:true);
}
export function challengeValue(s:ContractsState,id:ContractId):number {
 const task=challengeTask(s),values=challengeSamples(s).map(p=>challengeNet(s,id,p));
 return task.metric==='mean'?values.reduce((a,b)=>a+b,0):task.metric==='worst'?Math.min(...values):task.metric==='range'?-(Math.max(...values)-Math.min(...values)):values.filter(n=>task.metric==='interval'?n>=2&&n<=6:n>=task.threshold!).length;
}
export function challengeBest(s:ContractsState):ContractId[]{const values=challengeOffers(s).map(o=>({id:o.id,value:challengeValue(s,o.id)})),best=Math.max(...values.map(o=>o.value));return values.filter(o=>o.value===best).map(o=>o.id);}
export function challengeAccount(s:ContractsState,id:ContractId):string {
 const task=challengeTask(s),value=challengeValue(s,id),n=challengeSamples(s).length;
 return task.metric==='mean'?`${(value/n).toLocaleString('es-AR',{maximumFractionDigits:2})} fichas por tirada (${value} ÷ ${n})`:task.metric==='worst'?`en el peor caso perdés ${-value}`:task.metric==='range'?`${-value} fichas entre el mejor y el peor resultado`:`${value} de ${n} tiradas cumplen la meta`;
}
