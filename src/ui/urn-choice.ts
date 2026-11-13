import {probability,type Urn,type Color} from '../core/game';
interface UrnChoiceOptions {urn:Urn;index:0|1;event:Color;testId:string;selected:boolean;disabled:boolean;review?:boolean;correct?:boolean;hinted?:boolean;showPercent?:boolean}
/** Shared presentation for the same Urna 1 / Urna 2 controls in Vera and the boss. */
export function urnChoiceCard(o:UrnChoiceOptions):string {
 const {urn,index,event,selected,review,correct,hinted}=o,p=probability(urn,event);
 const percent=(p.denominator?100*p.numerator/p.denominator:0).toLocaleString('es-AR',{maximumFractionDigits:1});
 const color=event==='red'?'roja':'azul',plural=event==='red'?'rojas':'azules';
 const verdict=review?correct?'✓ Correcta':'✕ Menos posibilidades':hinted?'Elegí esta':selected?'✓ Elegida':'Elegir';
 return `<button data-testid="${o.testId}" class="urn-option ${selected?'selected':''} ${hinted?'hinted':''} ${review?correct?'answer-correct':'answer-incorrect':''}" aria-pressed="${selected}" ${o.disabled?'disabled':''}><span class="urn-option-head"><strong>Urna ${index+1}</strong><span>${verdict}</span></span>${review&&selected?'<span class="choice-caption">Tu elección</span>':''}<span class="inventory"><span class="red-token">▲</span> ${urn.red} ${urn.red===1?'roja':'rojas'} <span class="blue-token">●</span> ${urn.blue} ${urn.blue===1?'azul':'azules'}</span><span class="odds"><b>${p.numerator} de ${p.denominator} fichas ${p.numerator===1?'es':'son'} ${p.numerator===1?color:plural}</b><span>${o.showPercent===false?'Compará cuánto hay del color que buscás':`${percent} % de posibilidades de sacar ${color}`}</span></span></button>`;
}
