import type {FinaleState} from '../core/tables/finale';
import {HAND_POINTS} from '../core/tables/holdem';
/** Explain the existing damage; never calculate a different gameplay outcome. */
export function bossDamageParts(s:FinaleState):{label:string;amount:number}[]{
 const b=s.boss!,last=s.history.at(-1);if(!b.last||!last)return [];
 if(s.assisted)return [{label:'Ayuda guiada',amount:12}];
 const parts=[{label:'Tu decisión',amount:last.correct?2:0}];
 if(b.last.mechanic==='poker'&&b.poker?.result?.points){
  parts.push({label:'Tu mano',amount:HAND_POINTS[b.poker.result.choice]});
  parts.push({label:'Combo usado',amount:b.last.chargeBefore});
 }
 return parts;
}
export function bossDamageView(s:FinaleState):string {
 const b=s.boss!,parts=bossDamageParts(s),last=s.history.at(-1)!;
 const change=b.last!.chargeAfter-b.last!.chargeBefore;
 return `<div class="damage-breakdown" aria-label="Desglose del daño">${parts.map(p=>`<span>${p.label}<strong>+${p.amount}</strong></span>`).join('')}</div><p class="boss-resource-result">${s.assisted?'Ejemplo guiado.':!last.correct?'Defensas: −1 por tu elección.':'Defensas conservadas.'} ${b.last!.mechanic==='poker'?`Combo: ${b.last!.chargeBefore} → 0.`:change>0?`Combo: +${change}.`:b.charge===6?'Combo al máximo.':'El combo no cambió.'}</p>`;
}
