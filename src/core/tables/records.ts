import {photoChoices,photoBest,preparePhotos,revealPhotos} from './photo-records';
import {preparePoker,pokerBest,drawPoker,type PokerTable} from './poker-records';
import { uniform, type GameState } from '../game';
export type RecordsChoice = 'archive' | 'album' | 'observe' | 'close' | 'K' | 'V' | 'both' | 'certainty' | 'yes' | 'no';
export interface RecordsCommand { commandId: string; expectedRevision: number; type: 'begin' | 'choose' | 'next' | 'diagnose'; choice?: RecordsChoice }
export interface RecordsDecision { round: number; step: number; choice: RecordsChoice; optimal: RecordsChoice[]; correct: boolean; assisted: boolean }
export interface RecordsState {
  experience?:'photos-v1'|'photos-v2'|'cards-v1'; diagnostic?:'yes'|'no'|null; cards?:PokerTable;
  variant?:'repeat';
  seed: number; rng: GameState['rng']; phase: 'tutorial' | 'choose' | 'feedback' | 'complete';
  round: number; step: number; assisted: boolean; merit: number; source: 'album' | 'complete';
  observations: number[]; audit: number; history: RecordsDecision[]; revision: number; journal: RecordsCommand[];
}
export function createRecords(seed = Date.now(),repeat=false,experience:'photos-v1'|'photos-v2'|'cards-v1'|'legacy'='cards-v1'): RecordsState {
  const value = (seed>>>0)||0x9e3779b9;
  const base:RecordsState={...(repeat?{variant:'repeat' as const}:{}),seed:value,rng:{algorithm:'xorshift32-v1',state:value,count:0},phase:'tutorial',round:0,step:0,assisted:false,merit:0,source:'album',observations:[4,4,4,4],audit:2,history:[],revision:0,journal:[]};
  if(experience==='cards-v1'){base.experience=experience;preparePoker(base);return base;}
  return experience==='legacy'?base:{...base,experience,diagnostic:null};
}
export function recordsChoices(s: RecordsState): RecordsChoice[] {
  if(s.experience==='cards-v1')return ['K','V'];
  if(s.experience?.startsWith('photos-'))return photoChoices(s);
  const round=s.assisted ? s.round===0?0:1 : s.round;
  if(round===0 && s.step===0) return ['archive','album'];
  if(round===2) return s.step===0 ? ['K','V'] : ['K','V','both'];
  if(round===3 && s.step===1) return ['close','certainty'];
  return ['observe','close'];
}
export function bestRecords(s: RecordsState): RecordsChoice[] {
  if(s.experience==='cards-v1')return pokerBest(s);
  if(s.experience?.startsWith('photos-'))return photoBest(s);
  const round=s.assisted ? s.round===0?0:1 : s.round;
  if(round===0 && s.step===0) return ['archive'];
  if(round===2) return s.step===0 ? ['K'] : ['K','V','both'];
  return [s.step===0 ? 'observe':'close'];
}
function prepareRound(s: RecordsState): void {
  if(s.experience==='cards-v1'){preparePoker(s);return;}
  if(s.experience?.startsWith('photos-')){preparePhotos(s);return;}
  const round=s.assisted?s.round===0?0:1:s.round;
  s.source=round===0?'album':'complete'; s.audit=2;
  s.observations=round===3?s.variant==='repeat'?[4,0,4,4]:[0,0,0,0]:round===2?[0,4,0,4,0,4,0,4]:[4,4,4,4];
}
export function applyRecordsCommand(s: RecordsState, c: RecordsCommand): RecordsState {
  if(!c || typeof c.commandId!=='string' || !c.commandId.length || c.commandId.length>80 || c.expectedRevision!==s.revision || s.journal.some(x=>x.commandId===c.commandId)) return s;
  if(c.type==='diagnose'){
    if(!s.experience?.startsWith('photos-')||s.phase!=='tutorial'||s.diagnostic!==null||!['yes','no'].includes(c.choice!))return s;
    const next=structuredClone(s);next.diagnostic=c.choice as 'yes'|'no';next.revision++;next.journal.push(structuredClone(c));return next;
  }
  if(c.type==='begin'&&s.experience?.startsWith('photos-')&&s.diagnostic===null)return s;
  if(c.type==='begin' && s.phase!=='tutorial' || c.type==='choose' && (s.phase!=='choose' || !recordsChoices(s).includes(c.choice!)) || c.type==='next' && s.phase!=='feedback' || !['begin','choose','next'].includes(c.type)) return s;
  const next=structuredClone(s);
  if(c.type==='begin') next.phase='choose';
  if(c.type==='choose') {
    const optimal=bestRecords(s), correct=optimal.includes(c.choice!);
    if(s.assisted&&!correct) return s;
    next.history.push({round:s.round,step:s.step,choice:c.choice!,optimal,correct,assisted:s.assisted});
    if(correct&&!s.assisted) next.merit++;
    // Canonical second task is reachable even after an incorrect first decision.
    if(s.experience==='cards-v1')drawPoker(next,c.choice!);
    else if(s.experience?.startsWith('photos-'))revealPhotos(next);
    else if(s.step===0 && recordsChoices(s).includes('archive')) {next.source='complete';next.observations=[0,4,0,4,0,4,0,4];}
    else if(s.step===0 && recordsChoices(s).includes('observe')) {
      for(let i=0;i<4;i++) {
        if(s.assisted) next.observations.push(i%2===0?0:4);
        else {const draw=uniform(next.rng,2);next.rng=draw.rng;next.observations.push(draw.value*4);}
      }
      if(c.choice==='observe') next.audit--;
    }
    next.phase='feedback';
  }
  if(c.type==='next') {
    if(s.step===0) {next.step=1;next.phase='choose';}
    else if(s.assisted && s.round===1 || !s.assisted && s.round===3 && s.merit>=6) next.phase='complete';
    else {
      if(!s.assisted&&s.round===3) {next.assisted=true;next.round=0;} else next.round++;
      next.step=0;next.phase='choose';prepareRound(next);
    }
  }
  next.revision++;next.journal.push(structuredClone(c));return next;
}
export function validRecordsState(value: unknown): value is RecordsState {
  if(!value||typeof value!=='object') return false;
  const s=value as RecordsState;
  if(!Number.isInteger(s.seed)||s.seed<1||s.seed>0xffffffff||!Array.isArray(s.journal)||s.journal.length>28) return false;
  if(s.variant!==undefined&&s.variant!=='repeat')return false;
  if(s.experience!==undefined&&!['photos-v1','photos-v2','cards-v1'].includes(s.experience))return false;
  try {let replay=createRecords(s.seed,s.variant==='repeat',s.experience??'legacy');for(const c of s.journal){const next=applyRecordsCommand(replay,c);if(next===replay)return false;replay=next;}return JSON.stringify(replay)===JSON.stringify(s);}catch{return false;}
}
