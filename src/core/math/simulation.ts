import { uniform } from '../game';
import { CONTRACT_IDS, netPayout, type ContractId, type DicePair } from './dice';
export interface ComparisonRun { seed: number; count: 1 | 100; totals: Record<ContractId, number>; pairs: DicePair[] }
/** Separate local stream: the campaign never receives this RNG. Shared pairs compare contracts fairly. */
export function compareContracts(seed: number, count: 1 | 100): ComparisonRun {
  if (!Number.isInteger(seed) || seed < 1 || seed > 0xffffffff || count !== 1 && count !== 100) throw new Error('Invalid comparison parameters');
  let rng = { algorithm: 'xorshift32-v1' as const, state: seed >>> 0, count: 0 };
  const totals: Record<ContractId, number> = { S: 0, C: 0, J: 0 }, pairs: DicePair[] = [];
  for (let i = 0; i < count; i++) {
    const first = uniform(rng, 6), second = uniform(first.rng, 6); rng = second.rng;
    const pair: DicePair = [first.value + 1, second.value + 1]; pairs.push(pair);
    for (const id of CONTRACT_IDS) totals[id] += netPayout(id, pair);
  }
  return { seed, count, totals, pairs };
}
