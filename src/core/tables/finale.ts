import { choose, createGame, uniform, type GameState, type Urn, type Color } from '../game';
import { netPayout, type ContractId, type DicePair } from '../math/dice';
import {hostPolicy} from './host-policy';
export type FinaleChoice = 'U' | 'V' | ContractId | 'archive' | 'album' | 'close' | 'certainty';
export interface FinaleCommand {commandId:string;expectedRevision:number;type:'choose'|'next';choice?:FinaleChoice}
export interface FinaleDecision {round:number;step:number;choice:FinaleChoice;optimal:FinaleChoice[];correct:boolean;assisted:boolean;outcome:string}
export interface FinaleState {
  seed:number;rng:GameState['rng'];phase:'choose'|'feedback'|'complete';round:number;step:number;
  assisted:boolean;merit:number;tokens:number;balance:number;urns:[Urn,Urn];pair:DicePair|null;
  lastColor:Color|null;history:FinaleDecision[];revision:number;journal:FinaleCommand[];
}
export function createFinale(seed=Date.now()):FinaleState {
  const game=createGame(seed);
  return {seed:game.rng.state,rng:game.rng,phase:'choose',round:0,step:0,assisted:false,merit:0,tokens:0,balance:0,urns:game.urns,pair:null,lastColor:null,history:[],revision:0,journal:[]};
}
export function finaleRound(s:FinaleState):number{return s.assisted&&s.round===1?2:s.round;}
export function finaleChoices(s:FinaleState):FinaleChoice[]{const r=finaleRound(s);return r===0?['U','V']:r===1?['S','C','J']:s.step===0?['archive','album']:['close','certainty'];}
/** Host reads only the public task and urn inventory, never future random words. */
export function bestFinale(s:FinaleState):FinaleChoice[]{return hostPolicy({round:finaleRound(s),step:s.step,urns:s.urns});}
export function applyFinaleCommand(s:FinaleState,c:FinaleCommand):FinaleState {
  if(!c||typeof c.commandId!=='string'||!c.commandId.length||c.commandId.length>80||c.expectedRevision!==s.revision||s.journal.some(x=>x.commandId===c.commandId))return s;
  if(c.type==='choose'&&(s.phase!=='choose'||!finaleChoices(s).includes(c.choice!))||c.type==='next'&&s.phase!=='feedback'||!['choose','next'].includes(c.type))return s;
  const next=structuredClone(s);
  if(c.type==='choose'){
    const optimal=bestFinale(s),correct=optimal.includes(c.choice!);if(s.assisted&&!correct)return s;
    let outcome='Sin tirada: la decisión se evalúa por los datos disponibles.';
    if(finaleRound(s)===0){
      const game={...createGame(s.seed),urns:s.urns,rng:s.rng,step:s.step,assisted:s.assisted,phase:s.assisted?'guided' as const:'choose' as const};
      const result=choose(game,c.choice==='U'?0:1);next.urns=result.urns;next.rng=result.rng;next.lastColor=result.last!.color;
      if(!s.assisted&&next.lastColor==='red')next.tokens++;
      outcome=`Salió ${next.lastColor==='red'?'roja ▲':'azul ●'}. Quedó afuera. Volvé a contar antes de elegir.`;
    }else if(finaleRound(s)===1&&s.step===0){
      const a=uniform(next.rng,6),b=uniform(a.rng,6);next.rng=b.rng;next.pair=[a.value+1,b.value+1];const net=netPayout(c.choice as ContractId,next.pair);next.balance+=net;
      outcome=`Dados ${next.pair[0]} y ${next.pair[1]}. Neto ${net>0?'+':''}${net}. El saldo no abre ni cierra la puerta.`;
    }
    next.history.push({round:s.round,step:s.step,choice:c.choice!,optimal,correct,assisted:s.assisted,outcome});
    if(correct&&!s.assisted)next.merit++;next.phase='feedback';
  }else if(s.step===0){next.step=1;next.phase='choose';}
  else if(s.assisted&&s.round===1||!s.assisted&&s.round===2&&s.merit>=4)next.phase='complete';
  else {
    if(!s.assisted&&s.round===2){next.assisted=true;next.round=0;next.urns=createGame(1).urns;next.lastColor=null;}else next.round++;
    next.step=0;next.phase='choose';
  }
  next.revision++;next.journal.push(structuredClone(c));return next;
}
export function validFinaleState(value:unknown):value is FinaleState {
  if(!value||typeof value!=='object')return false;const s=value as FinaleState;
  if(!Number.isInteger(s.seed)||s.seed<1||s.seed>0xffffffff||!Array.isArray(s.journal)||s.journal.length>20)return false;
  try{let replay=createFinale(s.seed);for(const c of s.journal){const next=applyFinaleCommand(replay,c);if(next===replay)return false;replay=next;}return JSON.stringify(replay)===JSON.stringify(s);}catch{return false;}
}
