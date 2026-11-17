import {it,expect} from 'vitest';
import {createContracts,applyContractCommand,validContractsState,type ContractsState} from '../../src/core/tables/contracts';
import {challengeTask,challengeOffers,challengeBest,challengeNet,challengeSamples,challengeValue} from '../../src/core/tables/contract-challenges';
const cmd=(s:ContractsState,type:'begin'|'sign'|'next',contract?:'S'|'C'|'J')=>applyContractCommand(s,{type,...(contract?{contract}:{}),expectedRevision:s.revision,commandId:'c'+s.revision});
it('matches independently counted utility numerators for all eight tasks',()=>{
 const fixtures:[number,'offer'|'order',number[]][]=[[0,'offer',[72,60,108]],[0,'order',[0,16,6]],[1,'offer',[10,10,0]],[1,'order',[0,3,1]],[2,'offer',[-1,-2,-3]],[2,'order',[21,33,-45]],[3,'offer',[-2,-10,-10]],[3,'order',[8,45,4]]];
 for(const [round,phase,expected]of fixtures){const s={...createContracts(1,'varied'),round,phase,pair:[5,3] as const};expect(['S','C','J'].map(id=>challengeValue(s,id as 'S'|'C'|'J'))).toEqual(expected);}
});
it('provides eight distinct questions, four different offers and exact finite samples',()=>{
 let s=cmd(createContracts(31,'varied'),'begin');const ids=new Set(),offers=new Set();
 while(s.phase!=='complete'){
  if(s.phase==='offer'||s.phase==='order'){
   const task=challengeTask(s),samples=challengeSamples(s);ids.add(task.id);offers.add(JSON.stringify(challengeOffers(s)));
   expect(samples.length).toBeGreaterThan(0);expect(samples.length).toBeLessThanOrEqual(36);
   const values=challengeOffers(s).map(o=>({id:o.id,value:challengeValue(s,o.id)})),max=Math.max(...values.map(v=>v.value));expect(challengeBest(s)).toEqual(values.filter(v=>v.value===max).map(v=>v.id));
   s=cmd(s,'sign',challengeBest(s)[0]!);
  }else s=cmd(s,'next');expect(validContractsState(s)).toBe(true);
 }
 expect(ids.size).toBe(8);expect(offers.size).toBe(4);expect(s.merit).toBe(8);expect(s.rng.count).toBe(8);
});
it('uses only public past dice for a conditional comparison and never rolls the second answer',()=>{
 let s=cmd(createContracts(19,'varied'),'begin');
 while(!(s.round===1&&s.phase==='order'))s=s.phase==='offer'||s.phase==='order'?cmd(s,'sign',challengeBest(s)[0]!):cmd(s,'next');
 expect(challengeSamples(s)).toHaveLength(6);expect(challengeSamples(s).every(p=>p[0]===s.pair![0])).toBe(true);
 const n=cmd(s,'sign',challengeBest(s)[0]!);expect(n.pair).toEqual(s.pair);expect(n.rng).toEqual(s.rng);expect(n.balance).toBe(s.balance);expect(challengeOffers(s).every(o=>Number.isInteger(challengeNet(s,o.id,s.pair!)))).toBe(true);
});
it('preserves legacy journals and offers finite guided recovery for the varied game',()=>{
 let legacy=cmd(createContracts(22,'base'),'begin');legacy=cmd(legacy,'sign','J');expect(validContractsState(legacy)).toBe(true);
 let s=cmd(createContracts(22,'varied'),'begin');for(let i=0;i<80&&s.phase!=='complete';i++)s=s.phase==='offer'||s.phase==='order'?cmd(s,'sign',s.assisted?challengeBest(s)[0]!:challengeOffers(s).find(o=>!challengeBest(s).includes(o.id))!.id):cmd(s,'next');
 expect(s.phase).toBe('complete');expect(s.assisted).toBe(true);expect(validContractsState(s)).toBe(true);
});
