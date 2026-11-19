import { uniform } from '../game';
import type { GameState } from '../game';
import { bestContracts, CONTRACT_IDS, netPayout, type ContractId, type DicePair, type ObjectiveId } from '../math/dice';
import {challengeBest,challengeNet,challengeTask} from './contract-challenges';
import {bestDobleAnswers,diceDuelPoints,doblePick} from './dice-duel';

export const CONTRACT_ROUNDS: readonly (readonly [ObjectiveId, ObjectiveId])[] = [
  ['expected', 'guarantee1'], ['atLeast4', 'expected'], ['atLeast1', 'atLeast4'], ['atLeast10', 'range'],
];
export type ContractsPhase = 'tutorial' | 'first-die' | 'offer' | 'result' | 'order' | 'review' | 'complete' | 'retry';
export interface ContractDecision { round: number; step: 0 | 1; contract: ContractId; objective: ObjectiveId; correct: boolean; assisted: boolean; challenge?:string }
export interface ContractCommand { commandId: string; expectedRevision: number; type: 'begin' | 'roll-first' | 'sign' | 'next'; contract?: ContractId }
export interface DiceDuelRound { player:ContractId; rival:ContractId; playerPoints:number; rivalPoints:number; pair:DicePair; correct?:boolean }
interface DiceDuel { first:number|null; rivalScore:number; rounds:DiceDuelRound[] }
export interface ContractsState {
  variant: 'base' | 'repeat' | 'varied' | 'duel' | 'duel-probability'; phase: ContractsPhase; round: number; assisted: boolean; merit: number; balance: number;
  pair: DicePair | null; history: ContractDecision[]; rng: GameState['rng']; seed: number;
  revision: number; journal: ContractCommand[]; duel?:DiceDuel;
}
export const latestDobleVariant = 'duel-probability';
export function createContracts(seed = Date.now(), variant: ContractsState['variant'] = 'base'): ContractsState {
  const initialSeed = (seed >>> 0) || 0x9e3779b9;
  const state:ContractsState = { variant, phase: 'tutorial', round: 0, assisted: false, merit: 0, balance: 0, pair: null, history: [], rng: { algorithm: 'xorshift32-v1', state: initialSeed, count: 0 }, seed: initialSeed, revision: 0, journal: [] };
  if(variant==='duel'||variant===latestDobleVariant)state.duel={first:null,rivalScore:0,rounds:[]};
  return state;
}
export const splitDobleRound = (round:number):boolean => round===3 || round===7;

function applyDuelCommand(state: ContractsState, command: ContractCommand): ContractsState {
  const {type,contract}=command;
  if(type==='begin' ? state.phase!=='tutorial'
    : type==='roll-first' ? state.phase!=='first-die'
    : type==='sign' ? state.phase!=='offer' || !CONTRACT_IDS.includes(contract!)
    : type!=='next' || state.phase!=='result')return state;
  const next=structuredClone(state),duel=next.duel!;
  if(type==='begin')next.phase='offer';
  else if(type==='roll-first'){
    const die=uniform(next.rng,6);
    duel.first=die.value+1;
    next.rng=die.rng;
    next.phase='offer';
  }else if(type==='sign'){
    const rival=doblePick(state.round,duel.first);
    const correct=state.variant===latestDobleVariant?bestDobleAnswers(state.round,duel.first).includes(contract!):undefined;
    let first=duel.first;
    if(first===null){
      const die=uniform(next.rng,6);
      first=die.value+1;
      next.rng=die.rng;
    }
    const second=uniform(next.rng,6);
    next.rng=second.rng;
    const pair:DicePair=[first,second.value+1];
    const set=state.round<4?0:1;
    const playerPoints=correct?0:diceDuelPoints(set,contract!,pair);
    const rivalPoints=correct?0:diceDuelPoints(set,rival,pair);
    duel.rounds.push({player:contract!,rival,playerPoints,rivalPoints,pair,...(correct===undefined?{}:{correct})});
    if(correct)next.merit++;
    next.balance+=playerPoints;
    duel.rivalScore+=rivalPoints;
    next.pair=pair;
    next.phase='result';
  }else if(state.round===7){
    if(state.variant===latestDobleVariant&&state.merit===8)next.balance++;
    next.phase=next.balance>duel.rivalScore?'complete':'retry';
  }else{
    next.round++;
    next.pair=null;
    duel.first=null;
    next.phase=splitDobleRound(next.round)?'first-die':'offer';
  }
  next.revision++;
  next.journal.push(structuredClone(command));
  return next;
}
export function currentObjective(state: ContractsState): ObjectiveId {
  if(state.variant==='varied')return challengeTask(state).objective;
  if(state.assisted) return (state.round === 0 ? ['expected','guarantee1'] as const : ['atLeast4','range'] as const)[state.phase === 'order' || state.phase === 'review' ? 1 : 0];
  if(state.variant === 'repeat' && state.round === 3 && state.phase !== 'order' && state.phase !== 'review') return 'atLeast20';
  return CONTRACT_ROUNDS[state.round]![state.phase === 'order' || state.phase === 'review' ? 1 : 0];
}
/** Doble receives only the public objective, never a seed or the future dice. */
export function dobleAdvice(objective: ObjectiveId): { policy: 'public-objective-v1'; optimal: ContractId[] } {
  return { policy: 'public-objective-v1', optimal: bestContracts(objective) };
}
export function applyContractCommand(state: ContractsState, command: ContractCommand): ContractsState {
  if (!command || typeof command.commandId !== 'string' || command.commandId.length < 1 || command.commandId.length > 80 || command.expectedRevision !== state.revision || state.journal.some(c => c.commandId === command.commandId)) return state;
  if(state.duel)return applyDuelCommand(state,command);
  if (command.type === 'begin' && state.phase !== 'tutorial') return state;
  if (command.type === 'sign' && (!['offer', 'order'].includes(state.phase) || !CONTRACT_IDS.includes(command.contract!))) return state;
  if (command.type === 'next' && !['result', 'review'].includes(state.phase)) return state;
  if (!['begin', 'sign', 'next'].includes(command.type)) return state;
  const next = structuredClone(state);
  if (command.type === 'begin') next.phase = 'offer';
  if (command.type === 'sign') {
    const contract = command.contract!;
    const objective = currentObjective(state);
    const correct = (state.variant==='varied'?challengeBest(state):bestContracts(objective)).includes(contract);
    if (state.assisted && !correct) return state;
    next.history.push({ round: state.round, step: state.phase === 'offer' ? 0 : 1, contract, objective, correct, assisted: state.assisted,...(state.variant==='varied'?{challenge:challengeTask(state).id}:{}) });
    if (correct && !state.assisted) next.merit++;
    if (state.phase === 'offer') {
      if (state.assisted) next.pair = state.round === 0 ? [2, 2] : [3, 4];
      else {
        const first = uniform(state.rng, 6), second = uniform(first.rng, 6);
        next.pair = [first.value + 1, second.value + 1]; next.rng = second.rng;
        next.balance += state.variant==='varied'?challengeNet(state,contract,next.pair):netPayout(contract, next.pair);
      }
      next.phase = 'result';
    } else next.phase = 'review';
  }
  if (command.type === 'next') {
    if (state.phase === 'result') next.phase = 'order';
    else if (state.assisted && state.round === 1 || !state.assisted && state.round === 3 && state.merit >= 6) next.phase = 'complete';
    else {
      if (!state.assisted && state.round === 3) { next.assisted = true; next.round = 0; }
      else next.round++;
      next.phase = 'offer'; next.pair = null;
    }
  }
  next.revision++;
  next.journal.push(structuredClone(command));
  return next;
}
/** Replay accepted commands: validate scoring, dice, phases and RNG together. */
export function validContractsState(value: unknown): value is ContractsState {
  if (!value || typeof value !== 'object') return false;
  const saved = value as ContractsState;
  if (!['base','repeat','varied','duel',latestDobleVariant].includes(saved.variant) || !Number.isInteger(saved.seed) || saved.seed < 1 || saved.seed > 0xffffffff || !Array.isArray(saved.journal) || saved.journal.length > 40) return false;
  try {
    let reconstructed = createContracts(saved.seed, saved.variant);
    for (const command of saved.journal) {
      const next = applyContractCommand(reconstructed, command);
      if (next === reconstructed) return false;
      reconstructed = next;
    }
    return JSON.stringify(reconstructed) === JSON.stringify(saved);
  } catch { return false; }
}
