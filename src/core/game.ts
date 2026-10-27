import { validContractsState, type ContractsState } from './tables/contracts';
import { validRecordsState, type RecordsState } from './tables/records';
import { validFinaleState, type FinaleState } from './tables/finale';
export type Color = 'red' | 'blue';
export interface Urn { red: number; blue: number }
export interface Fraction { numerator: number; denominator: number }
export interface RoundConfig { id: string; urns: [Urn, Urn]; event: Color; replacement: boolean }
export interface Settings { reducedMotion: boolean; volume: number; textScale: number; sensitivity: number; keys: { forward: string; backward: string; left: string; right: string; interact: string } }
export interface Decision { urn: 0 | 1; color: Color; correct: boolean; optimal: number[]; beforeProbability: Fraction; round: number; step: number; assisted: boolean }
export interface GameState { records?: RecordsState; finale?: FinaleState; freed?: boolean; freedomMethod?: 'independent'|'assisted'; contracts?: ContractsState; activeTable?: 'urns' | 'contracts' | 'records' | 'finale' | 'outside'; seals?: { urns: boolean; contracts: boolean; records?: boolean; urnsMethod?: 'independent' | 'assisted'; contractsMethod?: 'independent' | 'assisted'; recordsMethod?: 'independent'|'assisted' }; phase: 'choose' | 'revealed' | 'roundEnd' | 'complete' | 'guided'; round: number; step: number; urns: [Urn, Urn]; event: Color; replacement: boolean; merit: number; tokens: number; last: Decision | null; history: Decision[]; rng: { algorithm: 'xorshift32-v1'; state: number; count: number }; assisted: boolean; settings: Settings }
export const defaultSettings: Settings = { reducedMotion: false, volume: 0.35, textScale: 1, sensitivity: 1, keys: {forward:'KeyW',backward:'KeyS',left:'KeyA',right:'KeyD',interact:'KeyE'} };
const rounds: RoundConfig[] = [
  {id:'U1',urns:[{red:3,blue:2},{red:1,blue:1}],event:'red',replacement:false},
  {id:'U2',urns:[{red:3,blue:2},{red:1,blue:1}],event:'blue',replacement:true},
  {id:'U3',urns:[{red:2,blue:1},{red:3,blue:2}],event:'red',replacement:false},
  {id:'U4',urns:[{red:1,blue:3},{red:2,blue:3}],event:'blue',replacement:false},
];
export function configFor(state: GameState): RoundConfig { return structuredClone(rounds[state.assisted ? (state.round === 0 ? 0 : 2) : state.round]!); }
export function probability(urn: Urn, event: Color): Fraction { return {numerator:urn[event],denominator:urn.red+urn.blue}; }
export function bestChoices(state: GameState): number[] { const [a,b] = state.urns.map(u=>probability(u,state.event)) as [Fraction,Fraction]; const d=a.numerator*b.denominator-b.numerator*a.denominator; return d===0 ? [0,1] : d>0 ? [0] : [1]; }
export function createGame(seed = Date.now()): GameState { const r=rounds[0]!; return {phase:'choose',round:0,step:0,urns:structuredClone(r.urns),event:r.event,replacement:r.replacement,merit:0,tokens:0,last:null,history:[],rng:{algorithm:'xorshift32-v1',state:(seed>>>0)||0x9e3779b9,count:0},assisted:false,settings:structuredClone(defaultSettings)}; }
/** Rejection sampling over the nonzero xorshift cycle (2^32 - 1 words). */
export function uniform(rng: GameState['rng'], n: number): {value:number; rng:GameState['rng']} { if(!Number.isInteger(n)||n<1||n>0xffffffff) throw new Error('Invalid random bound'); let x=rng.state,count=rng.count; const limit=Math.floor(0xffffffff/n)*n; for(;;){x^=x<<13;x^=x>>>17;x^=x<<5;x>>>=0;count++; const word=x-1;if(word<limit)return {value:word%n,rng:{algorithm:'xorshift32-v1',state:x,count}};} }
export function choose(state: GameState, urnIndex: 0|1): GameState {
  if((state.phase!=='choose'&&state.phase!=='guided')||(urnIndex!==0&&urnIndex!==1))return state;
  const optimal=bestChoices(state); if(state.assisted&&!optimal.includes(urnIndex))return state;
  const next=structuredClone(state),urn=next.urns[urnIndex]; const beforeProbability=probability(urn,state.event);
  let color:Color;
  if(state.assisted){color=state.step===0?'red':(urn.red>0?'red':'blue');}
  else {const sample=uniform(state.rng,urn.red+urn.blue);next.rng=sample.rng;color=sample.value<urn.red?'red':'blue';}
  const correct=optimal.includes(urnIndex); const last:Decision={urn:urnIndex,color,correct,optimal,beforeProbability,round:state.round,step:state.step,assisted:state.assisted};
  if(!state.replacement)urn[color]--;
  next.merit+=correct&&!state.assisted?1:0;next.tokens+=!state.assisted&&color===state.event?1:0;next.last=last;next.history.push(last);next.phase='revealed';return next;
}
export function advance(state:GameState):GameState {
  const next=structuredClone(state);
  if(state.phase==='revealed'){
    if(state.step===0){next.step=1;next.phase=state.assisted?'guided':'choose';}
    else next.phase='roundEnd';
    return next;
  }
  if(state.phase!=='roundEnd')return state;
  if(state.assisted&&state.round===1){next.phase='complete';return next;}
  if(!state.assisted&&state.round===3){if(state.merit>=6){next.phase='complete';return next;}next.assisted=true;next.round=0;}
  else next.round++;
  next.step=0;next.last=null;next.phase=next.assisted?'guided':'choose';const r=configFor(next);next.urns=r.urns;next.event=r.event;next.replacement=r.replacement;return next;
}

export interface SaveStorage {getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
const key='thegame.save.v1'; const maxSize=262144;
function storageOrDefault(storage?:SaveStorage):SaveStorage {return storage??globalThis.localStorage;}
function parse(raw:string|null): {state:GameState|null;future:boolean} {
  if(!raw||raw.length>maxSize)return {state:null,future:false};
  try {const d=JSON.parse(raw) as {schemaVersion?:number;contentVersion?:string;state?:GameState};if(typeof d.schemaVersion==='number'&&d.schemaVersion>3)return {state:null,future:true};if(!((d.schemaVersion===1&&d.contentVersion==='urns-mvp-v1')||(d.schemaVersion===2&&d.contentVersion==='urns-contracts-v2')||(d.schemaVersion===3&&d.contentVersion==='campaign-v3'))||!validState(d.state))return {state:null,future:false};return {state:d.state!,future:false};}catch{return {state:null,future:false};}
}
const integer=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isInteger(n)&&n>=min&&n<=max;
export function validState(value:unknown):value is GameState {
  if(!value||typeof value!=='object')return false; const s=value as GameState;
  if(s.contracts!==undefined&&!validContractsState(s.contracts))return false;
  if(s.records!==undefined&&!validRecordsState(s.records))return false;
  if(s.finale!==undefined&&!validFinaleState(s.finale))return false;
  if(s.activeTable!==undefined&&!['urns','contracts','records','finale','outside'].includes(s.activeTable))return false;
  if(s.freed!==undefined&&typeof s.freed!=='boolean')return false;
  if(s.freedomMethod!==undefined&&!['independent','assisted'].includes(s.freedomMethod))return false;
  if(s.seals?.records!==undefined&&typeof s.seals.records!=='boolean')return false;
  if(s.seals?.recordsMethod!==undefined&&!['independent','assisted'].includes(s.seals.recordsMethod))return false;
  if(s.records&&!(s.seals?.contracts||s.contracts?.phase==='complete'))return false;
  if(s.finale&&!(s.seals?.records||s.records?.phase==='complete'))return false;
  if(s.activeTable==='records'&&!s.records||s.activeTable==='finale'&&!s.finale||s.activeTable==='outside'&&!s.freed)return false;
  if(s.seals!==undefined&&(!s.seals||typeof s.seals.urns!=='boolean'||typeof s.seals.contracts!=='boolean'))return false;
  if(s.seals?.urnsMethod!==undefined&&!['independent','assisted'].includes(s.seals.urnsMethod))return false;
  if(s.seals?.contractsMethod!==undefined&&!['independent','assisted'].includes(s.seals.contractsMethod))return false;
  if(s.contracts&&!(s.seals?.urns||s.phase==='complete'))return false;
  if(s.activeTable==='contracts'&&!s.contracts)return false;
  if(!['choose','revealed','roundEnd','complete','guided'].includes(s.phase)||!integer(s.round,0,s.assisted?1:3)||!integer(s.step,0,1)||typeof s.assisted!=='boolean'||!integer(s.merit,0,8)||!integer(s.tokens,0,8))return false;
  if(!Array.isArray(s.urns)||s.urns.length!==2||!s.urns.every(u=>u&&integer(u.red,0,5)&&integer(u.blue,0,5)&&(u.red+u.blue>0||(s.step===1&&['revealed','roundEnd','complete'].includes(s.phase))))||!['red','blue'].includes(s.event)||typeof s.replacement!=='boolean')return false;
  if(!s.rng||s.rng.algorithm!=='xorshift32-v1'||!integer(s.rng.state,1,0xffffffff)||!integer(s.rng.count,0,1000000))return false;
  if(!Array.isArray(s.history)||s.history.length>12||!s.history.every(validDecision)||!(s.last===null||validDecision(s.last)))return false;
  const settings=s.settings;if(!settings||typeof settings.reducedMotion!=='boolean'||!Number.isFinite(settings.volume)||settings.volume<0||settings.volume>1||!Number.isFinite(settings.textScale)||settings.textScale<0.8||settings.textScale>2||!Number.isFinite(settings.sensitivity)||settings.sensitivity<0.1||settings.sensitivity>4||!settings.keys||!['forward','backward','left','right','interact'].every(k=>typeof settings.keys[k as keyof Settings['keys']]==='string'&&settings.keys[k as keyof Settings['keys']].length<40))return false;
  const config=configFor(s);
  if(config.event!==s.event||config.replacement!==s.replacement||((s.phase==='revealed'||s.phase==='roundEnd')&&s.last===null)||(s.phase==='guided'&&!s.assisted)||(s.assisted&&s.phase==='choose'))return false;
  const committed=['revealed','roundEnd','complete'].includes(s.phase)?1:0;
  if((s.phase==='roundEnd'||s.phase==='complete')&&s.step!==1)return false;
  const expected=(s.assisted?8:0)+s.round*2+s.step+committed;
  if(s.history.length!==expected||s.rng.count<s.history.filter(d=>!d.assisted).length)return false;
  if(s.merit!==s.history.filter(d=>!d.assisted&&d.correct).length||s.tokens!==s.history.filter(d=>!d.assisted&&d.color===rounds[d.round]!.event).length)return false;
  if(s.phase==='complete'&&(!s.assisted&&(s.round!==3||s.merit<6)||s.assisted&&s.round!==1))return false;
  if(s.assisted&&s.merit>=6)return false;
  let currentUrns=structuredClone(config.urns);
  for(let i=0;i<s.history.length;i++){
    const d=s.history[i]!,assisted=i>=8,round=assisted?Math.floor((i-8)/2):Math.floor(i/2),step=i%2;
    if(d.round!==round||d.step!==step||d.assisted!==assisted)return false;
    const c=rounds[assisted?(round===0?0:2):round]!;
    const urns=structuredClone(c.urns);
    if(step===1){const prev=s.history[i-1]!;if(!c.replacement)urns[prev.urn][prev.color]--;}
    const publicState={...s,urns,event:c.event};const optimal=bestChoices(publicState),p=probability(urns[d.urn],c.event);
    if(urns[d.urn][d.color]===0||d.correct!==optimal.includes(d.urn)||JSON.stringify(d.optimal)!==JSON.stringify(optimal)||d.beforeProbability.numerator!==p.numerator||d.beforeProbability.denominator!==p.denominator)return false;
    if(assisted&&(!d.correct||(step===0&&d.color!=='red')))return false;
    if(d.assisted===s.assisted&&d.round===s.round){if(!c.replacement)currentUrns[d.urn][d.color]--;}
  }
  if(JSON.stringify(currentUrns)!==JSON.stringify(s.urns))return false;
  const currentHistory=s.history.filter(d=>d.assisted===s.assisted&&d.round===s.round);
  return JSON.stringify(s.last)===JSON.stringify(currentHistory.at(-1)??null);
}
function validDecision(d:Decision):boolean {return !!d&&(d.urn===0||d.urn===1)&&['red','blue'].includes(d.color)&&typeof d.correct==='boolean'&&typeof d.assisted==='boolean'&&integer(d.round,0,3)&&integer(d.step,0,1)&&Array.isArray(d.optimal)&&d.optimal.length>0&&d.optimal.length<=2&&d.optimal.every(n=>n===0||n===1)&&!!d.beforeProbability&&integer(d.beforeProbability.numerator,0,10)&&integer(d.beforeProbability.denominator,1,10)&&d.beforeProbability.numerator<=d.beforeProbability.denominator;}
export function loadGame(storage?:SaveStorage):{state:GameState|null;warning:string|null} {try{const store=storageOrDefault(storage),current=parse(store.getItem(key+'.current'));if(current.future)return {state:null,warning:'Este guardado pertenece a una versión futura. Se conserva sin modificar.'};if(current.state)return {state:current.state,warning:null};const backup=parse(store.getItem(key+'.backup'));if(backup.future)return {state:null,warning:'La copia guardada pertenece a una versión futura y se conserva.'};if(backup.state)return {state:backup.state,warning:'Se recuperó la copia de seguridad del progreso.'};return {state:null,warning:store.getItem(key+'.current')||store.getItem(key+'.backup')?'El guardado no es válido. Podés iniciar una práctica nueva.':null};}catch{return {state:null,warning:'El navegador no permite leer el progreso guardado.'};}}
export function saveGame(state:GameState,storage?:SaveStorage):string|null {try {const store=storageOrDefault(storage),old=store.getItem(key+'.current');if(parse(old).future||parse(store.getItem(key+'.backup')).future)return 'El guardado de una versión futura se conserva. La partida continúa en memoria.';if(!validState(state))return 'El estado no es válido y no se guardó.';const raw=JSON.stringify({schemaVersion:3,contentVersion:'campaign-v3',state});store.setItem(key+'.pending',raw);if(!parse(store.getItem(key+'.pending')).state)throw new Error('Save verification');if(parse(old).state)store.setItem(key+'.backup',old!);store.setItem(key+'.current',raw);store.removeItem(key+'.pending');return null;}catch{return 'No se pudo guardar. Tu partida continúa en memoria; no cierres esta pestaña.';}}
export function clearGame(storage?:SaveStorage):void {try {const store=storageOrDefault(storage);for(const suffix of ['.current','.backup','.pending'])store.removeItem(key+suffix);}catch{/* Caller can still start an in-memory practice. */}}
