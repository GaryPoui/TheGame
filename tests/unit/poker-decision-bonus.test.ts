import {it,expect} from 'vitest';
import {createRecords,applyRecordsCommand,bestRecords,validRecordsState,type RecordsState} from '../../src/core/tables/records';
import {resolveHoldem,handOdds,HAND_POINTS} from '../../src/core/tables/holdem';
import {createGame,saveGame,loadGame,type SaveStorage} from '../../src/core/game';
const command=(s:RecordsState,type:'begin'|'next'|'enable-bonus')=>applyRecordsCommand(s,{type,commandId:type+s.revision,expectedRevision:s.revision});
it('adds two for every tied maximum of probability times prize, independently of the river or duel',()=>{
 const outcomes=new Set<string>();
 for(let seed=1;seed<=120;seed++){
  let s=command(createRecords(seed),'enable-bonus');expect(s.decisionBonus).toBe(true);s=command(s,'begin');
  const odds=handOdds(s.holdem!.player,s.holdem!.board),max=Math.max(...odds.map(o=>o.count*HAND_POINTS[o.category]));
  expect(bestRecords(s)).toEqual(odds.filter(o=>o.count*HAND_POINTS[o.category]===max).map(o=>o.category));
  for(const o of odds.filter(o=>o.count>0)){
   const raw=resolveHoldem(s.holdem!,s.rng,o.category),bonus=o.count*HAND_POINTS[o.category]===max?2:0;
   const c={type:'choose' as const,choice:o.category,commandId:'choose',expectedRevision:s.revision};const n=applyRecordsCommand(s,c);
   expect(n.merit-s.merit).toBe(raw.table.result!.points+bonus);expect(n.holdem!.result!.decisionBonus).toBe(bonus);expect(n.rng).toEqual(raw.rng);expect(validRecordsState(n)).toBe(true);expect(applyRecordsCommand(n,c)).toBe(n);
   if(bonus)outcomes.add(raw.table.result!.winner);if(bonus&&raw.table.result!.player.category!==o.category)outcomes.add('miss');
  }
 }
 expect(outcomes).toContain('player');expect(outcomes).toContain('opponent');expect(outcomes).toContain('tie');expect(outcomes).toContain('miss');
});
it('loads a v8 campaign and writes the enabled bonus in a protected current envelope',()=>{
 const data=new Map<string,string>(),store:SaveStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v);},removeItem:k=>{data.delete(k);}};
 const s=createGame(5);s.records=createRecords(22);s.activeTable='records';s.seals={urns:true,contracts:true,records:false};data.set('thegame.save.v1.current',JSON.stringify({schemaVersion:8,contentVersion:'campaign-boss-v8',state:s}));
 const loaded=loadGame(store).state!;expect(loaded).toEqual(s);loaded.records=command(loaded.records!,'enable-bonus');expect(saveGame(loaded,store)).toBeNull();expect(JSON.parse(data.get('thegame.save.v1.current')!).schemaVersion).toBe(11);expect(loadGame(store).state).toEqual(loaded);
 const future=JSON.stringify({schemaVersion:11,contentVersion:'future'});data.set('thegame.save.v1.current',future);expect(saveGame(loaded,store)).toContain('futura');expect(data.get('thegame.save.v1.current')).toBe(future);
});
it('upgrades an existing journal without recalculating previous points or changing its deal',()=>{
 let old=command(createRecords(22),'begin');old=applyRecordsCommand(old,{type:'choose',choice:bestRecords(old)[0],commandId:'old-choice',expectedRevision:old.revision});expect(validRecordsState(old)).toBe(true);
 const n=command(old,'enable-bonus');expect(n.decisionBonus).toBe(true);expect(n.merit).toBe(old.merit);expect(n.holdem).toEqual(old.holdem);expect(n.rng).toEqual(old.rng);expect(n.history).toEqual(old.history);expect(validRecordsState(n)).toBe(true);expect(command(n,'enable-bonus')).toBe(n);
 expect(validRecordsState({...old,decisionBonus:true})).toBe(false);
});
