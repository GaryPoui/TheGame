import {DICE_PAIRS,type ContractId,type DicePair,type ObjectiveId} from '../math/dice';
import type {ContractsState} from './contracts';
export interface ChallengeOffer {id:ContractId;name:string;cost:number;gross:number;rule:string;gate:'any'|'center'|'seven'|'low'|'high'|'doubles'|'even'|'odd'|'edge'|'stepped'|'sum'}
const offer=(id:ContractId,name:string,cost:number,gross:number,gate:ChallengeOffer['gate'],rule:string):ChallengeOffer=>({id,name,cost,gross,gate,rule});
const sets:readonly ChallengeOffer[][]=[
 [offer('S','Seguro',0,2,'any','Cobrás 2 con cualquier suma.'),offer('C','Centro',1,6,'center','Cobrás 6 si suman 6, 7 u 8.'),offer('J','Siete',1,24,'seven','Cobrás 24 si suman 7.')],
 [offer('S','Bajo',1,6,'low','Cobrás 6 si suman 5 o menos.'),offer('C','Alto',1,6,'high','Cobrás 6 si suman 9 o más.'),offer('J','Dobles',1,10,'doubles','Cobrás 10 si ambos dados coinciden.')],
 [offer('S','Par',1,6,'even','Cobrás 6 con suma par.'),offer('C','Impar',2,7,'odd','Cobrás 7 con suma impar.'),offer('J','Extremos',3,20,'edge','Cobrás 20 con suma 2 o 12.')],
 [offer('S','Acotado',1,4,'stepped','Cobrás 4 hasta suma 7; con 8 o más, cobrás 2.'),offer('C','Creciente',2,0,'sum','Cobrás tantas fichas como la suma de los dados.'),offer('J','Encuentro',3,12,'doubles','Cobrás 12 con dobles; con otro par, cobrás 2.')],
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
  {id:'long-run',title:'¿Cuál deja más fichas en promedio?',explanation:'Sumá los netos de los 36 pares y dividí por 36. El coste se paga también cuando perdés.',objective:'expected',metric:'mean'},
  {id:'four-after-cost',title:'¿Con cuál es más probable ganar 4 o más?',explanation:'La meta es el resultado después de pagar. Es una comparación para una futura tirada, sin volver a tirar ahora.',objective:'atLeast4',metric:'reach',threshold:4},
  {id:'within-budget',title:'¿Cuál tiene más chances de dejar entre 2 y 6?',explanation:'Contá sólo netos de 2 a 6, incluidos ambos extremos. Un premio mayor puede quedar fuera de esa franja.',objective:'atLeast4',metric:'interval'},
  {id:'known-first',title:`Si el primer dado vuelve a ser ${first}, ¿cuál conviene?`,explanation:`En esa futura tirada quedan seis resultados posibles para el segundo dado. Buscá la mayor chance de ganar 4 o más. La tirada anterior no cambia.`,objective:'atLeast4',metric:'reach',threshold:4},
  {id:'worst-case',title:'¿Cuál limita mejor tu peor pérdida?',explanation:'Compará el peor neto posible de cada oferta. Todas pueden perder: elegí la pérdida menos grande.',objective:'guarantee1',metric:'worst'},
  {id:'ordered-dice',title:'Si el segundo supera al primero, ¿cuál promedia más?',explanation:'Imaginá esa condición para una futura tirada. Hay 15 pares posibles. Los dobles quedan fuera.',objective:'expected',metric:'mean'},
  {id:'smallest-spread',title:'¿Cuál tiene menos distancia entre su mejor y peor neto?',explanation:'Restá el peor resultado al mejor. El rango más pequeño da la menor variación.',objective:'range',metric:'range'},
  {id:'six-first',title:'Con un 6 en el primer dado, ¿cuál promedia más?',explanation:'Compará una futura tirada con ese primer dado conocido. Promediá los seis netos que deja el segundo.',objective:'expected',metric:'mean'},
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
 return task.metric==='mean'?`${value} ÷ ${n} = ${(value/n).toLocaleString('es-AR',{maximumFractionDigits:2})} de promedio`:task.metric==='worst'?`Peor neto: ${value}`:task.metric==='range'?`Rango: ${-value}`:`${value} de ${n} pares cumplen la meta`;
}
