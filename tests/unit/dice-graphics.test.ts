import {it,expect} from 'vitest';
import {winningPairGroups} from '../../src/ui/contracts';
import {grossPayout,type ContractId} from '../../src/core/math/dice';
it('dice graphics represent every paying ordered pair exactly once',()=>{for(const id of ['S','C','J'] as ContractId[]){const pairs=winningPairGroups(id).flatMap(g=>g.pairs.flatMap(([a,b])=>a===b?[[a,b]]:[[a,b],[b,a]]));const expected=[];for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(grossPayout(id,[a,b])>0)expected.push(`${a},${b}`);expect(pairs.map(p=>p.join(',')).sort()).toEqual(expected.sort());expect(new Set(pairs.map(p=>p.join(','))).size).toBe(pairs.length);}});
