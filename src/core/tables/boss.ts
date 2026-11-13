import {uniform,type Color} from '../game';
import {bestContracts,netPayout,supportsObjective,type ContractId,type ObjectiveId} from '../math/dice';
import {dealHoldem,resolveHoldem,handOdds,HAND_POINTS,type HoldemTable,type HandCategory} from './holdem';
import type {FinaleState,FinaleChoice,FinaleCommand} from './finale';
export type BossMechanic='urns'|'dice'|'poker';
export interface BossState {
 health:number;defences:number;charge:number;variant:number;started:boolean;needsHelp:boolean;guideStep:number;urnDraws:number;
 target:Color;objective:ObjectiveId;poker?:HoldemTable;
 last?:{mechanic:BossMechanic;damage:number;chargeBefore:number;chargeAfter:number;text:string};
}
const order:BossMechanic[]=['urns','dice','poker'];
export function bossMechanic(s:FinaleState):BossMechanic {return s.assisted?order[s.boss!.guideStep]!:order[(s.step+s.round+s.boss!.variant)%3]!;}
export function prepareBossStage(s:FinaleState):void {
 const b=s.boss!;b.target=(s.round+b.variant)%2===0?'red':'blue';
 b.urnDraws=0;
 b.objective=(['atLeast4','expected','guarantee1'] as ObjectiveId[])[(s.round+b.variant)%3]!;
 s.urns=structuredClone(([[{red:4,blue:2},{red:2,blue:3}],[{red:1,blue:3},{red:3,blue:2}],[{red:2,blue:2},{red:1,blue:4}]] as const)[(s.round+b.variant)%3]!) as FinaleState['urns'];
 s.pair=null;s.lastColor=null;
 if(bossMechanic(s)==='poker'){const deal=dealHoldem(s.rng);s.rng=deal.rng;b.poker=deal.table;}
}
export function initializeBoss(s:FinaleState):void {
 s.boss={health:36,defences:6,charge:0,variant:s.seed%3,started:false,needsHelp:false,guideStep:0,urnDraws:0,target:'red',objective:'expected'};prepareBossStage(s);
}
export function bossChoices(s:FinaleState):FinaleChoice[]{
 if(!s.boss!.started||s.boss!.needsHelp)return [];
 return bossMechanic(s)==='urns'?['U','V']:bossMechanic(s)==='dice'?['S','C','J']:['high-card','pair','two-pair','three-kind','straight','flush','full-house','four-kind','straight-flush'];
}
export function bestBoss(s:FinaleState):FinaleChoice[]{
 const b=s.boss!,kind=bossMechanic(s);
 if(kind==='dice')return bestContracts(b.objective);
 if(kind==='poker'){
  const odds=handOdds(b.poker!.player,b.poker!.board),best=Math.max(...odds.map(o=>o.count*(HAND_POINTS[o.category]+b.charge)));
  return odds.filter(o=>o.count*(HAND_POINTS[o.category]+b.charge)===best).map(o=>o.category);
 }
 const [a,c]=s.urns,delta=a[b.target]*(c.red+c.blue)-c[b.target]*(a.red+a.blue);
 return delta>0?['U']:delta<0?['V']:['U','V'];
}
export function applyBossCommand(s:FinaleState,c:FinaleCommand):FinaleState {
 if(c.type==='begin'){
  if(s.boss!.started||s.phase!=='choose')return s;
  const n=structuredClone(s);n.boss!.started=true;return record(n,c);
 }
 if(c.type==='assist'){
  if(!s.boss!.needsHelp||s.phase!=='choose')return s;
  const n=structuredClone(s);n.assisted=true;n.boss={...n.boss!,health:36,defences:6,charge:0,needsHelp:false,guideStep:0};n.phase='choose';prepareBossStage(n);return record(n,c);
 }
 if(c.type==='choose'){
  if(s.phase!=='choose'||!bossChoices(s).includes(c.choice!))return s;
  const optimal=bestBoss(s),correct=optimal.includes(c.choice!);if(s.assisted&&!correct)return s;
  const n=structuredClone(s),b=n.boss!,kind=bossMechanic(s),before=b.charge;let damage=correct?2:0,text='';
  if(kind==='urns'){
   const urn=n.urns[c.choice==='U'?0:1],draw=uniform(n.rng,urn.red+urn.blue);n.rng=draw.rng;n.lastColor=draw.value<urn.red?'red':'blue';urn[n.lastColor]--;
   b.urnDraws++;
   if(n.lastColor===b.target)b.charge=Math.min(6,b.charge+1);
   text=`Salió ${n.lastColor==='red'?'roja ▲':'azul ●'}. ${n.lastColor===b.target?'Cargaste el combo.':'La carga no cambió.'}`;
  }else if(kind==='dice'){
   const a=uniform(n.rng,6),d=uniform(a.rng,6);n.rng=d.rng;n.pair=[a.value+1,d.value+1];const net=netPayout(c.choice as ContractId,n.pair);n.balance+=net;
   if(supportsObjective(c.choice as ContractId,n.pair,b.objective))b.charge=Math.min(6,b.charge+2);
   text=`Dados ${n.pair[0]} y ${n.pair[1]}. Resultado ${net>0?'+':''}${net} fichas. ${b.charge>before?'Combo cargado.':'La carga no cambió.'}`;
  }else{
   const reveal=resolveHoldem(b.poker!,n.rng,c.choice as Parameters<typeof resolveHoldem>[2]);n.rng=reveal.rng;b.poker=reveal.table;
   const result=b.poker.result!,hit=result.points>0;
   const hitDamage=HAND_POINTS[c.choice as HandCategory]+b.charge;
   if(hit)damage+=hitDamage;
   text=hit?`Acertaste y ganaste: golpe de ${hitDamage} además de la lectura.`:result.winner==='tie'?'Empate de póker: no se activa el combo.':result.winner==='opponent'?'El anfitrión ganó el duelo: no se activa el combo.':'La categoría no coincidió: no se activa el combo.';
   b.charge=0;
  }
  if(s.assisted)damage=12;
  if(!correct&&!s.assisted)b.defences=Math.max(0,b.defences-1);
  b.health=Math.max(0,b.health-damage);b.last={mechanic:kind,damage,chargeBefore:before,chargeAfter:b.charge,text};
  const outcome=`${correct?'Lectura óptima.':'Había una opción de mayor utilidad.'} ${text} Daño: ${damage}.`;
  n.history.push({round:s.round,step:s.step,choice:c.choice!,optimal,correct,assisted:s.assisted,outcome});if(correct&&!s.assisted)n.merit++;
  n.phase='feedback';return record(n,c);
 }
 if(c.type==='next'&&s.phase==='feedback'){
  const n=structuredClone(s),b=n.boss!;
  if(b.health===0)n.phase='complete';
  else if(!s.assisted&&b.last?.mechanic==='urns'&&b.urnDraws===1&&b.defences>0){n.phase='choose';}
  else{
   if(n.assisted)b.guideStep++;
   else if(n.step===2){n.round++;n.step=0;}else n.step++;
   n.phase='choose';b.needsHelp=!n.assisted&&(b.defences===0||n.round>=6);
   if(!b.needsHelp)prepareBossStage(n);
  }
  return record(n,c);
 }
 return s;
}
function record(s:FinaleState,c:FinaleCommand):FinaleState {s.revision++;s.journal.push(structuredClone(c));return s;}
